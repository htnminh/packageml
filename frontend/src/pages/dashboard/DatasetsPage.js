import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  Tab,
  Tabs,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slider,
  Alert,
  Stack,
  CircularProgress,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import TableChartIcon from '@mui/icons-material/TableChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
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

// Mock data for datasets - will be replaced with real data from API
const mockDatasets = [
  { 
    id: 1, 
    name: 'Customer Data', 
    filename: 'customer_data.csv', 
    rows: 10250, 
    columns: 15, 
    size: '2.4 MB', 
    uploaded: '2023-05-15',
    type: 'CSV',
    missing_values: 120,
    used_in_jobs: 2
  },
  { 
    id: 2, 
    name: 'Sales Data', 
    filename: 'sales_data.csv', 
    rows: 5430, 
    columns: 8, 
    size: '1.1 MB', 
    uploaded: '2023-06-01',
    type: 'CSV',
    missing_values: 0,
    used_in_jobs: 1
  },
  { 
    id: 3, 
    name: 'Product Catalog', 
    filename: 'products.json', 
    rows: 1250, 
    columns: 12, 
    size: '780 KB', 
    uploaded: '2023-06-10',
    type: 'JSON',
    missing_values: 45,
    used_in_jobs: 0
  }
];

// Mock dataset details - will be replaced with real data from API
const mockDatasetDetails = {
  id: 1,
  name: 'Customer Data',
  filename: 'customer_data.csv',
  description: 'Customer demographic and subscription data for churn analysis',
  created: '2023-05-15',
  tags: ['customers', 'demographics', 'churn'],
  columns: [
    { name: 'customer_id', type: 'string', missing: 0, example: 'CUST001' },
    { name: 'age', type: 'integer', missing: 12, example: '34' },
    { name: 'gender', type: 'string', missing: 0, example: 'Female' },
    { name: 'subscription_length', type: 'integer', missing: 0, example: '24' },
    { name: 'monthly_charges', type: 'float', missing: 0, example: '65.75' },
    { name: 'total_charges', type: 'float', missing: 32, example: '1578.00' },
    { name: 'churn', type: 'boolean', missing: 0, example: 'True' }
  ],
  sample_data: [
    { customer_id: 'CUST001', age: 34, gender: 'Female', subscription_length: 24, monthly_charges: 65.75, total_charges: 1578.00, churn: true },
    { customer_id: 'CUST002', age: 46, gender: 'Male', subscription_length: 12, monthly_charges: 42.50, total_charges: 510.00, churn: false },
    { customer_id: 'CUST003', age: 29, gender: 'Male', subscription_length: 6, monthly_charges: 70.25, total_charges: 421.50, churn: true }
  ]
};

const DatasetsPage = () => {
  debugLog("Rendering DatasetsPage component");
  
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [randomizeOpen, setRandomizeOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [datasets, setDatasets] = useState(mockDatasets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for randomize dialog
  const [datasetType, setDatasetType] = useState('Customer Data');
  const [numRows, setNumRows] = useState(100);
  const [randomizeLoading, setRandomizeLoading] = useState(false);
  const [randomizeError, setRandomizeError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Memoize formatSize function to avoid recreating it on every render
  const formatSize = useCallback((bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }, []);

  // Fetch datasets on component mount
  useEffect(() => {
    debugLog("DatasetsPage useEffect triggered");
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    debugLog("Fetching datasets...");
    setLoading(true);
    setError(null);
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/datasets/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      debugLog("API response:", response.data);
      
      // Transform API response to match UI format
      const formattedDatasets = response.data.map(dataset => ({
        id: dataset.id,
        name: dataset.name,
        filename: dataset.filename,
        rows: dataset.rows,
        columns: dataset.columns,
        size: formatSize(dataset.size),
        uploaded: new Date(dataset.created_at).toISOString().split('T')[0],
        type: dataset.file_type,
        missing_values: dataset.missing_values,
        used_in_jobs: dataset.used_in_jobs
      }));
      
      setDatasets(formattedDatasets.length > 0 ? formattedDatasets : mockDatasets);
    } catch (err) {
      console.error('Error fetching datasets:', err);
      setError('Failed to load datasets. Please try again later.');
      // Fallback to mock data for demo purposes
      setDatasets(mockDatasets);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = useCallback(async (datasetId) => {
    debugLog("Viewing details for dataset ID:", datasetId);
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/datasets/${datasetId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Format the response to match UI expectations
      const datasetDetails = {
        id: response.data.id,
        name: response.data.name,
        filename: response.data.filename,
        description: response.data.description || 'No description provided',
        created: new Date(response.data.created_at).toISOString().split('T')[0],
        tags: response.data.tags ? response.data.tags.split(',') : [],
        columns: response.data.column_schema,
        sample_data: response.data.sample_data
      };
      
      setSelectedDataset(datasetDetails);
    } catch (err) {
      console.error('Error fetching dataset details:', err);
      // Fallback to mock data for demo purposes
      setSelectedDataset(mockDatasetDetails);
    }
    
    setDetailsOpen(true);
  }, [navigate]);

  const handleDeleteDataset = useCallback(async (datasetId) => {
    if (!window.confirm('Are you sure you want to delete this dataset?')) {
      return;
    }
    
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`${API_URL}/datasets/${datasetId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from local state
      setDatasets(prevDatasets => prevDatasets.filter(dataset => dataset.id !== datasetId));
    } catch (err) {
      console.error('Error deleting dataset:', err);
      alert('Failed to delete dataset. Please try again.');
    }
  }, [navigate]);

  const handleOpenRandomizeDialog = useCallback(() => {
    debugLog("Opening randomize dialog");
    setRandomizeOpen(true);
  }, []);

  const handleRandomizeDataset = async () => {
    debugLog("Randomizing dataset:", { datasetType, numRows });
    setRandomizeLoading(true);
    setRandomizeError(null);
    
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${API_URL}/datasets/randomize/`,
        {
          dataset_type: datasetType,
          num_rows: numRows
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      debugLog("Randomize response:", response.data);
      
      // Add the new dataset to the list
      const newDataset = {
        id: response.data.id,
        name: response.data.name,
        filename: response.data.filename,
        rows: response.data.rows,
        columns: response.data.columns,
        size: formatSize(response.data.size),
        uploaded: new Date(response.data.created_at).toISOString().split('T')[0],
        type: response.data.file_type,
        missing_values: response.data.missing_values,
        used_in_jobs: response.data.used_in_jobs
      };
      
      setDatasets(prevDatasets => [...prevDatasets, newDataset]);
      setRandomizeOpen(false);
      
      // Show success message with non-intrusive notification
      setSnackbarMessage(`Successfully created random ${datasetType} with ${numRows} rows (ID: ${response.data.id})`);
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error creating random dataset:', err);
      setRandomizeError(err.response?.data?.detail || 'Failed to create random dataset. Please try again.');
    } finally {
      setRandomizeLoading(false);
    }
  };

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  return (
    <>
      {/* Main interface header with buttons */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Datasets
          </Typography>
          <Box>
            {/* RANDOMIZE DATASET BUTTON - PROMINENT */}
            <Button 
              variant="contained"
              color="primary" 
              size="large"
              startIcon={<ShuffleIcon />}
              onClick={handleOpenRandomizeDialog}
              sx={{ mr: 2, bgcolor: '#1976d2', px: 3 }}
            >
              Randomize Dataset
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate('/dashboard/datasets/new')}
              sx={{ px: 3 }}
            >
              Upload Dataset
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Error message if any */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Datasets table */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ mr: 2 }} />
            <Typography>Loading datasets...</Typography>
          </Box>
        ) : datasets.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No datasets found.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<ShuffleIcon />}
              onClick={handleOpenRandomizeDialog}
              sx={{ mt: 2 }}
            >
              Randomize Your First Dataset
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">File</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Rows</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Columns</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Size</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Uploaded</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>{dataset.name}</TableCell>
                    <TableCell>{dataset.filename}</TableCell>
                    <TableCell>{dataset.rows.toLocaleString()}</TableCell>
                    <TableCell>{dataset.columns}</TableCell>
                    <TableCell>{dataset.size}</TableCell>
                    <TableCell>{dataset.uploaded}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleViewDetails(dataset.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteDataset(dataset.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dataset Details Dialog */}
      {selectedDataset && (
        <Dialog 
          open={detailsOpen} 
          onClose={() => setDetailsOpen(false)} 
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedDataset.name}</Typography>
              <Box>
                <Chip 
                  icon={<TableChartIcon />} 
                  label={`${selectedDataset.columns.length} columns`} 
                  size="small" 
                  sx={{ mr: 1 }} 
                />
                <Chip 
                  icon={<AssessmentIcon />} 
                  label={`${selectedDataset.sample_data.length} rows shown`} 
                  size="small" 
                />
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="dataset tabs">
                <Tab label="Preview" />
                <Tab label="Stats" />
                <Tab label="Metadata" />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {selectedDataset.columns.map((column) => (
                          <TableCell key={column.name}>
                            <Typography variant="body2" fontWeight="bold">
                              {column.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {column.type}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedDataset.sample_data.map((row, index) => (
                        <TableRow key={index}>
                          {selectedDataset.columns.map((column) => (
                            <TableCell key={`${index}-${column.name}`}>
                              {row[column.name]?.toString() || ''}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {tabValue === 1 && (
              <Grid container spacing={3}>
                {selectedDataset.columns.map((column) => (
                  <Grid item xs={12} md={6} lg={4} key={column.name}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">
                          {column.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {column.type}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            Missing: {column.missing} values
                          </Typography>
                          <Typography variant="body2">
                            Example: {column.example}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {tabValue === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Basic Information
                      </Typography>
                      <Typography variant="body2">
                        <strong>Dataset ID:</strong> {selectedDataset.id}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Filename:</strong> {selectedDataset.filename}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Created:</strong> {selectedDataset.created}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Description:</strong> {selectedDataset.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedDataset.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Randomize Dataset Dialog */}
      <Dialog 
        open={randomizeOpen} 
        onClose={() => !randomizeLoading && setRandomizeOpen(false)} 
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Randomize New Dataset</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {randomizeError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {randomizeError}
            </Alert>
          )}
          
          <Stack spacing={3}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Dataset Type</FormLabel>
              <RadioGroup
                value={datasetType}
                onChange={(e) => setDatasetType(e.target.value)}
              >
                <FormControlLabel value="Customer Data" control={<Radio />} label="Customer Data" />
                <FormControlLabel value="Sales Data" control={<Radio />} label="Sales Data" />
                <FormControlLabel value="Product Catalog" control={<Radio />} label="Product Catalog" />
              </RadioGroup>
            </FormControl>
            
            <Box>
              <Typography gutterBottom>
                Number of Rows: {numRows}
              </Typography>
              <Slider
                value={numRows}
                onChange={(e, newValue) => setNumRows(newValue)}
                min={1}
                max={2000}
                step={10}
                marks={[
                  { value: 1, label: '1' },
                  { value: 500, label: '500' },
                  { value: 1000, label: '1000' },
                  { value: 2000, label: '2000' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Alert severity="info">
              Due to platform scaling limitations, datasets are limited to 20 columns and 5000 rows.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => !randomizeLoading && setRandomizeOpen(false)}
            disabled={randomizeLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleRandomizeDataset}
            disabled={randomizeLoading}
            startIcon={randomizeLoading ? <CircularProgress size={24} /> : <ShuffleIcon />}
            sx={{ px: 3 }}
          >
            {randomizeLoading ? 'Generating...' : 'Randomize Dataset'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Snackbar for non-intrusive notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
};

export default DatasetsPage; 