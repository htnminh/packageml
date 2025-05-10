import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
  Divider,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Production flag - set to true when in production
const isProduction = process.env.NODE_ENV === 'production';

// Debug logger function that only logs in development
const debugLog = (message, data) => {
  if (!isProduction && console) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

const NewDatasetPage = () => {
  debugLog("Rendering NewDatasetPage component");

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [firstRowIsHeader, setFirstRowIsHeader] = useState(true);
  const [fileExtension, setFileExtension] = useState('');

  // Add an effect to ensure component mounts correctly
  useEffect(() => {
    debugLog("NewDatasetPage component mounted");
  }, []);

  // Function to read the file content and store it
  const readFileContent = useCallback((file) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      const fileExt = file.name.split('.').pop().toLowerCase();
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setIsLoading(false);
        resolve({ content: e.target.result, extension: fileExt });
      };
      
      reader.onerror = (e) => {
        setIsLoading(false);
        reject(new Error('Error reading file'));
      };
      
      if (fileExt === 'csv' || fileExt === 'json') {
        reader.readAsText(file);
      } else if (['xlsx', 'xls'].includes(fileExt)) {
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('Unsupported file type'));
      }
    });
  }, []);
  
  // Function to parse the file content and generate preview
  const parseFile = useCallback(() => {
    if (!file || !fileContent) {
      setFileError('No file selected or file content not loaded');
      return;
    }
    
    setIsLoading(true);
    setFilePreview(null);
    setFileError('');
    
    try {
      const { content, extension } = fileContent;
      
      // Parse CSV files
      if (extension === 'csv') {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
          throw new Error('CSV file is empty');
        }
        
        let columns = [];
        let data = [];
        
        if (firstRowIsHeader) { 
          // Use first row as headers
          columns = lines[0].split(',').map((col, index) => {
            const trimmed = col.trim().replace(/^"|"$/g, '');
            return trimmed || `Column${index + 1}`;
          });
          
          // Start from second row for data
          for (let i = 1; i < Math.min(lines.length, 6); i++) {
            const values = lines[i].split(',').map(val => val.trim().replace(/^"|"$/g, ''));
            const row = {};
            
            columns.forEach((col, index) => {
              row[col] = index < values.length ? values[index] : '';
            });
            
            data.push(row);
          }
        } else {
          // Generate column names
          const firstLineValues = lines[0].split(',');
          columns = Array.from(
            { length: firstLineValues.length }, 
            (_, index) => `Column${index + 1}`
          );
          
          // Use all rows as data including first row
          for (let i = 0; i < Math.min(lines.length, 6); i++) {
            const values = lines[i].split(',').map(val => val.trim().replace(/^"|"$/g, ''));
            const row = {};
            
            columns.forEach((col, index) => {
              row[col] = index < values.length ? values[index] : '';
            });
            
            data.push(row);
          }
        }
        
        debugLog("CSV Preview generated", { isHeaderRow: firstRowIsHeader, columns, rows: data });
        setFilePreview({ columns, data });
      }
      // Parse JSON files
      else if (extension === 'json') {
        try {
          const jsonData = JSON.parse(content);
          
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            const columns = Object.keys(jsonData[0]);
            const data = jsonData.slice(0, 5);
            
            if (columns.length > 20) {
              throw new Error(`File exceeds maximum of 20 columns (has ${columns.length})`);
            }
            
            setFilePreview({ columns, data });
          } else if (typeof jsonData === 'object') {
            const columns = Object.keys(jsonData);
            const data = [jsonData];
            
            if (columns.length > 20) {
              throw new Error(`File exceeds maximum of 20 columns (has ${columns.length})`);
            }
            
            setFilePreview({ columns, data });
          } else {
            throw new Error('Invalid JSON format: must contain object or array');
          }
        } catch (err) {
          throw new Error(`Invalid JSON format: ${err.message}`);
        }
      }
      // Parse Excel files
      else if (['xlsx', 'xls'].includes(extension)) {
        try {
          // Parse Excel data
          const workbook = XLSX.read(content, { type: 'array' });
          
          if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error('Invalid Excel file or no sheets found');
          }
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          if (!worksheet) {
            throw new Error('Invalid sheet data in Excel file');
          }
          
          // Get all rows with header:1 option (all data as array of arrays)
          const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (!allRows || allRows.length === 0) {
            throw new Error('Excel file appears to be empty');
          }
          
          let columns = [];
          let data = [];
          
          if (firstRowIsHeader) {
            // First row contains headers
            if (!allRows[0] || allRows[0].length === 0) {
              throw new Error('First row is empty, cannot use as headers');
            }
            
            // Use first row as column headers
            columns = allRows[0].map((col, idx) => 
              col !== undefined && col !== null ? String(col) : `Column${idx + 1}`
            );
            
            // Use rows 2+ as data
            for (let i = 1; i < Math.min(allRows.length, 6); i++) {
              if (allRows[i]) {
                const row = {};
                columns.forEach((col, idx) => {
                  row[col] = idx < allRows[i].length ? 
                    (allRows[i][idx] !== undefined ? allRows[i][idx] : '') : '';
                });
                data.push(row);
              }
            }
          } else {
            // Generate column names
            if (!allRows[0] || allRows[0].length === 0) {
              throw new Error('First row is empty, cannot determine column count');
            }
            
            // Create generic column names
            columns = Array.from(
              { length: allRows[0].length }, 
              (_, idx) => `Column${idx + 1}`
            );
            
            // Use all rows as data
            for (let i = 0; i < Math.min(allRows.length, 6); i++) {
              if (allRows[i]) {
                const row = {};
                columns.forEach((col, idx) => {
                  row[col] = idx < allRows[i].length ? 
                    (allRows[i][idx] !== undefined ? allRows[i][idx] : '') : '';
                });
                data.push(row);
              }
            }
          }
          
          if (columns.length > 20) {
            throw new Error(`File exceeds maximum of 20 columns (has ${columns.length})`);
          }
          
          debugLog("Excel Preview generated", { isHeaderRow: firstRowIsHeader, columns, rows: data });
          setFilePreview({ columns, data });
        } catch (err) {
          throw new Error(`Error parsing Excel file: ${err.message}`);
        }
      } else {
        throw new Error(`Unsupported file type: ${extension}`);
      }
    } catch (err) {
      console.error('Error generating preview:', err);
      setFileError(err.message || 'Error generating preview');
      setFilePreview(null);
    } finally {
      setIsLoading(false);
    }
  }, [file, fileContent, firstRowIsHeader]);

  const handleFileChange = useCallback(async (e) => {
    debugLog("File selection changed");
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    debugLog("Selected file:", selectedFile.name, selectedFile.size);
    
    // Clear previous previews and errors
    setFilePreview(null);
    setFileError('');
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFileError('File is too large. Maximum size is 10MB.');
      setFile(null);
      setFileContent(null);
      return;
    }
    
    // Validate file type
    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'json', 'xlsx', 'xls'].includes(fileExt)) {
      setFileError('Invalid file type. Supported formats: CSV, JSON, Excel (xlsx, xls)');
      setFile(null);
      setFileContent(null);
      return;
    }
    
    setFile(selectedFile);
    setFileExtension(fileExt);
    
    // Suggest filename as dataset name if not set
    if (!name) {
      const suggestedName = selectedFile.name.split('.')[0]
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      setName(suggestedName);
    }
    
    try {
      // Read file content
      const content = await readFileContent(selectedFile);
      setFileContent(content);
    } catch (err) {
      console.error('Error reading file:', err);
      setFileError(err.message || 'Error reading file');
    }
  }, [name, readFileContent]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    debugLog("Submitting form");
    
    // Validate form
    if (!name.trim()) {
      setError('Please enter a dataset name');
      return;
    }
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        debugLog("No token found, redirecting to login");
        navigate('/login');
        return;
      }
      
      debugLog("Uploading file:", file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('description', description || '');
      formData.append('first_row_is_header', firstRowIsHeader.toString());

      await axios.post(
        `${API_URL}/datasets/upload/`, 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      debugLog("File uploaded successfully");
      // Navigate back to datasets page
      navigate('/dashboard/datasets');
    } catch (err) {
      console.error('Error uploading dataset:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to upload dataset. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [name, description, file, navigate, firstRowIsHeader]);

  const handleGoBack = useCallback(() => {
    debugLog("Navigating back to datasets page");
    navigate('/dashboard/datasets');
  }, [navigate]);

  return (
    <>
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleGoBack}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Back to Datasets
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Upload New Dataset
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Upload a CSV, JSON, or Excel file to create a new dataset
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            Due to platform scaling limitations, datasets are limited to 20 columns and 5000 rows. 
            All files will be converted to CSV format for storage.
          </Typography>
        </Alert>
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Dataset Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ mb: 4, mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
              size="large"
            >
              Select File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".csv,.json,.xlsx,.xls"
              />
            </Button>
            
            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography>Processing file...</Typography>
              </Box>
            )}
            
            {file && !isLoading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ color: 'success.main', mb: 1 }}>
                  Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  File type: {fileExtension.toUpperCase()} 
                  {fileExtension !== 'csv' && 
                    " (will be converted to CSV)"}
                </Typography>
                
                {(fileExtension === 'csv' || ['xlsx', 'xls'].includes(fileExtension)) && (
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={firstRowIsHeader}
                          onChange={(e) => setFirstRowIsHeader(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="First row contains column headers"
                    />
                    
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<PreviewIcon />}
                      onClick={parseFile}
                      sx={{ ml: 2 }}
                      disabled={isLoading}
                    >
                      Generate Preview
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            
            {fileError && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                <Typography fontWeight="bold">Error in file:</Typography>
                <Typography>{fileError}</Typography>
              </Alert>
            )}
          </Box>
          
          {/* File preview */}
          {filePreview && !isLoading && !fileError && (
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Data Preview
              </Typography>
              
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {filePreview.columns.map((column, index) => (
                        <TableCell key={index}>
                          <Typography variant="body2" fontWeight="bold">
                            {column}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filePreview.data.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {filePreview.columns.map((column, colIndex) => (
                          <TableCell key={`${rowIndex}-${colIndex}`}>
                            {row[column] !== undefined ? String(row[column]) : ''}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                Showing first 5 rows of data
              </Typography>
            </Paper>
          )}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || !file || !!fileError || isLoading}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              sx={{ px: 4, py: 1, fontSize: '1.1rem' }}
              size="large"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Dataset'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default NewDatasetPage; 