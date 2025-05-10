import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Snackbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CancelIcon from '@mui/icons-material/Cancel';
import TuneIcon from '@mui/icons-material/Tune';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Helper function to parse query parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// New Job Dialog Component
const CreateJobDialog = ({ models, onClose, onJobCreated }) => {
  const [newJob, setNewJob] = useState({
    name: '',
    description: '',
    model_id: '',
    dataset_id: '',
    target_column: '',
    feature_columns: []
  });
  
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [availableColumns, setAvailableColumns] = useState([]);

  // Fetch datasets when component mounts
  useEffect(() => {
    fetchDatasets();
  }, []);

  // When model_id changes, update selectedModel
  useEffect(() => {
    if (newJob.model_id && models.length > 0) {
      const model = models.find(m => m.id === parseInt(newJob.model_id));
      setSelectedModel(model);
    }
  }, [newJob.model_id, models]);

  // When dataset_id changes, fetch the dataset columns
  useEffect(() => {
    if (newJob.dataset_id) {
      fetchDatasetColumns(newJob.dataset_id);
    }
  }, [newJob.dataset_id]);

  // When target column changes, update feature columns
  useEffect(() => {
    if (newJob.target_column && availableColumns.length > 0) {
      const features = availableColumns.filter(col => col !== newJob.target_column);
      setNewJob(prev => ({ ...prev, feature_columns: features }));
    }
  }, [newJob.target_column, availableColumns]);

  const fetchDatasets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/datasets/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDatasets(response.data);
    } catch (err) {
      console.error('Error fetching datasets:', err);
      setError('Failed to load datasets');
    }
  };

  const fetchDatasetColumns = async (datasetId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/datasets/${datasetId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const columns = response.data.column_schema.map(col => col.name);
      setAvailableColumns(columns);
    } catch (err) {
      console.error('Error fetching dataset columns:', err);
      setError('Failed to load dataset columns');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (trainNow) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Validate required fields
      if (!newJob.name || !newJob.model_id) {
        setError('Name and model are required');
        setLoading(false);
        return;
      }
      
      // For supervised models, target column is required
      if (selectedModel && (selectedModel.task_type === 'classification' || selectedModel.task_type === 'regression') && !newJob.target_column) {
        setError('Target column is required for supervised learning');
        setLoading(false);
        return;
      }
      
      // Don't add status field - it doesn't exist in the backend schema
      const jobData = {
        ...newJob
      };
      
      const response = await axios.post(
        `${API_URL}/jobs/`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // If trainNow is true, start the job immediately after creation
      if (trainNow && response.data.id) {
        await axios.put(
          `${API_URL}/jobs/${response.data.id}/start`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      
      onJobCreated(response.data);
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err.response?.data?.detail || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Job Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Job Name"
              name="name"
              value={newJob.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Description (Optional)"
              name="description"
              value={newJob.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={1}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Model Selection
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Model</InputLabel>
              <Select
                name="model_id"
                value={newJob.model_id}
                onChange={handleInputChange}
                label="Model"
              >
                {models.map(model => (
                  <MenuItem key={model.id} value={model.id.toString()}>
                    ID: {model.id} - {model.name} ({model.task_type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Dataset</InputLabel>
              <Select
                name="dataset_id"
                value={newJob.dataset_id}
                onChange={handleInputChange}
                label="Dataset"
              >
                {datasets.map(dataset => (
                  <MenuItem key={dataset.id} value={dataset.id.toString()}>
                    ID: {dataset.id} - {dataset.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {selectedModel && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                  Training Configuration
                </Typography>
              </Grid>
              
              {(selectedModel.task_type === 'classification' || selectedModel.task_type === 'regression') && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Target Column</InputLabel>
                    <Select
                      name="target_column"
                      value={newJob.target_column}
                      onChange={handleInputChange}
                      label="Target Column"
                      disabled={availableColumns.length === 0}
                    >
                      {availableColumns.map(column => (
                        <MenuItem key={column} value={column}>{column}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Selected Model Information:
                  </Typography>
                  <Typography variant="body2">
                    Type: {selectedModel.model_type} | Task: {selectedModel.task_type}
                  </Typography>
                  
                  {newJob.target_column && (
                    <>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Target Column:</strong> {newJob.target_column}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Feature Columns:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {newJob.feature_columns.map((column, idx) => (
                          <Chip key={idx} label={column} size="small" />
                        ))}
                      </Box>
                    </>
                  )}
                </Alert>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => handleSubmit(false)}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} /> : null}
        >
          {loading ? 'Creating...' : 'Save for Later'}
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => handleSubmit(true)}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} /> : <PlayArrowIcon />}
        >
          {loading ? 'Creating...' : 'Train Now'}
        </Button>
      </DialogActions>
    </>
  );
};

const JobsPage = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const modelId = query.get('modelId');
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [newJobDialogOpen, setNewJobDialogOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Fetch jobs on component mount
  useEffect(() => {
    debugLog("JobsPage useEffect triggered");
    fetchJobs();
    fetchModels();
    
    // If modelId is provided, open the new job dialog
    if (modelId) {
      setNewJobDialogOpen(true);
    }
    
    // Set up polling for job status updates
    const intervalId = setInterval(() => {
      fetchJobs(false); // Don't show loading indicator for polling
    }, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [modelId]);

  const fetchModels = async () => {
    debugLog("Fetching models...");
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/models/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const fetchJobs = async (showLoading = true) => {
    debugLog("Fetching jobs...");
    if (showLoading) setLoading(true);
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("An error occurred while fetching jobs.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleStartJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await axios.put(`${API_URL}/jobs/${jobId}/start`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      fetchJobs();
      setSnackbarMessage('Job started successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error starting job:", error);
      setSnackbarMessage('Failed to start job');
      setOpenSnackbar(true);
    }
  };

  const handleCancelJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to cancel this job?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await axios.put(`${API_URL}/jobs/${jobId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      fetchJobs();
      setSnackbarMessage('Job cancelled successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error cancelling job:", error);
      setSnackbarMessage('Failed to cancel job');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await axios.delete(`${API_URL}/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      setSnackbarMessage('Job deleted successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting job:", error);
      setSnackbarMessage('Failed to delete job');
      setOpenSnackbar(true);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewResults = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    setSelectedJob(job);
    setResultDialogOpen(true);
  };

  const getStatusChip = (status) => {
    let color;
    
    switch (status) {
      case 'completed':
        color = 'success';
        break;
      case 'in_progress':
        color = 'info';
        break;
      case 'failed':
        color = 'error';
        break;
      case 'pending':
        color = 'warning';
        break;
      default:
        color = 'default';
    }
    
    return <Chip color={color} label={status} size="small" />;
  };

  // Filter jobs based on selected tab
  const getFilteredJobs = () => {
    if (tabValue === 0) return jobs;
    
    const statusFilters = ['all', 'completed', 'in_progress', 'failed'];
    const statusFilter = statusFilters[tabValue];
    
    if (statusFilter === 'all') return jobs;
    return jobs.filter(job => job.status === statusFilter);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Jobs
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<AddIcon />}
          onClick={() => setNewJobDialogOpen(true)}
        >
          Create New Job
        </Button>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="job tabs">
          <Tab label="All Jobs" />
          <Tab label="Completed" />
          <Tab label="In Progress" />
          <Tab label="Failed" />
        </Tabs>
      </Box>
      
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ mr: 2 }} />
            <Typography>Loading jobs...</Typography>
          </Box>
        ) : jobs.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={6}>
            No jobs found. Create a new job to start training a model.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">ID</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Job Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Model</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Dataset</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Progress</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Created</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredJobs().map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.id}</TableCell>
                    <TableCell>{job.name}</TableCell>
                    <TableCell>{job.model_name}</TableCell>
                    <TableCell>{job.dataset_name}</TableCell>
                    <TableCell>{getStatusChip(job.status)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 180 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={job.progress} 
                            color={job.status === 'failed' ? 'error' : 'primary'}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">{`${Math.round(job.progress)}%`}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(job.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        {job.status === 'completed' && (
                          <IconButton 
                            color="primary" 
                            onClick={() => handleViewResults(job.id)}
                            size="small"
                            title="View Results"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        )}
                        {job.status === 'pending' && (
                          <IconButton 
                            color="primary" 
                            onClick={() => handleStartJob(job.id)}
                            size="small"
                            title="Start Job"
                          >
                            <PlayArrowIcon fontSize="small" />
                          </IconButton>
                        )}
                        {job.status === 'in_progress' && (
                          <IconButton 
                            color="warning" 
                            onClick={() => handleCancelJob(job.id)}
                            size="small"
                            title="Cancel Job"
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteJob(job.id)}
                          size="small"
                          title="Delete Job"
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

      {/* Create Job Dialog */}
      <Dialog 
        open={newJobDialogOpen} 
        onClose={() => setNewJobDialogOpen(false)} 
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Create New Training Job</Typography>
        </DialogTitle>
        <CreateJobDialog 
          models={models}
          onClose={() => setNewJobDialogOpen(false)}
          onJobCreated={(newJob) => {
            fetchJobs();
            setNewJobDialogOpen(false);
            setSnackbarMessage('Job created successfully');
            setOpenSnackbar(true);
            
            // Clear modelId from URL if it exists
            if (modelId) {
              navigate('/dashboard/jobs');
            }
          }}
        />
      </Dialog>

      {/* Results Dialog */}
      {selectedJob && (
        <Dialog open={resultDialogOpen} onClose={() => setResultDialogOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Results: {selectedJob.name}</Typography>
              {selectedJob.results && (
                <Chip 
                  label={`Accuracy: ${selectedJob.results.accuracy 
                    ? (selectedJob.results.accuracy * 100).toFixed(2) + '%' 
                    : 'N/A'}`} 
                  color="success" 
                />
              )}
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            {!selectedJob.results ? (
              <Alert severity="info">No results available for this job.</Alert>
            ) : (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                        <Table size="small">
                          <TableBody>
                            {Object.entries(selectedJob.results || {}).map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell component="th" scope="row">
                                  <Typography variant="body2" fontWeight="bold">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2">
                                    {typeof value === 'number' ? value.toFixed(4) : String(value)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Job Information</Typography>
                        <Typography variant="body2">
                          <strong>Model:</strong> {selectedJob.model_name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Dataset:</strong> {selectedJob.dataset_name}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Started:</strong> {selectedJob.started_at ? new Date(selectedJob.started_at).toLocaleString() : 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Completed:</strong> {selectedJob.completed_at ? new Date(selectedJob.completed_at).toLocaleString() : 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Duration:</strong> {selectedJob.started_at && selectedJob.completed_at 
                            ? Math.round((new Date(selectedJob.completed_at) - new Date(selectedJob.started_at)) / 1000) + ' seconds' 
                            : 'N/A'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResultDialogOpen(false)}>Close</Button>
            <Button variant="contained" color="primary">Export Results</Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Snackbar for notifications */}
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

export default JobsPage; 