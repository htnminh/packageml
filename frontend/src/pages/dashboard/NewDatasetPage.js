import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormHelperText,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [fileType, setFileType] = useState('CSV');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState('');

  // Add an effect to ensure component mounts correctly
  useEffect(() => {
    debugLog("NewDatasetPage component mounted");
  }, []);

  const handleFileChange = useCallback((e) => {
    debugLog("File selection changed");
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    debugLog("Selected file:", selectedFile.name, selectedFile.size);
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFileError('File is too large. Maximum size is 10MB.');
      return;
    }
    
    // Validate file type
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'json', 'xlsx', 'xls'].includes(fileExtension)) {
      setFileError('Invalid file type. Supported formats: CSV, JSON, Excel (xlsx, xls)');
      return;
    }
    
    setFile(selectedFile);
    setFileError('');
    
    // Auto-set file type based on extension
    if (fileExtension === 'csv') {
      setFileType('CSV');
    } else if (fileExtension === 'json') {
      setFileType('JSON');
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      setFileType('Excel');
    }
  }, []);

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
      formData.append('file_type', fileType);

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
  }, [name, description, file, fileType, navigate]);

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
          
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">File Type</FormLabel>
            <RadioGroup
              row
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <FormControlLabel value="CSV" control={<Radio />} label="CSV" />
              <FormControlLabel value="JSON" control={<Radio />} label="JSON" />
              <FormControlLabel value="Excel" control={<Radio />} label="Excel" />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mb: 4, mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 1 }}
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
            {file && (
              <Typography variant="body1" sx={{ mt: 1, color: 'success.main' }}>
                Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
              </Typography>
            )}
            {fileError && (
              <FormHelperText error sx={{ fontSize: '1rem' }}>{fileError}</FormHelperText>
            )}
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || !file || !!fileError}
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