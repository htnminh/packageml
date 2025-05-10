import React, { useState, useEffect, useCallback } from 'react';
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
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
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

// Helper functions for descriptions
const getHyperparameterDescription = (param) => {
  const descriptions = {
    'C': 'Regularization parameter. Lower values mean stronger regularization.',
    'penalty': 'Type of regularization penalty to use.',
    'solver': 'Algorithm for optimization problem.',
    'max_iter': 'Maximum number of iterations to converge.',
    'kernel': 'Kernel type to be used in the algorithm.',
    'gamma': 'Kernel coefficient for RBF, poly and sigmoid kernels.',
    'random_state': 'Random number seed for reproducibility.',
    'hidden_layer_sizes': 'Number of neurons in each hidden layer.',
    'activation': 'Activation function for hidden layer.',
    'learning_rate': 'Learning rate schedule for weight updates.',
    'learning_rate_init': 'Initial learning rate.',
    'n_clusters': 'Number of clusters to form.',
    'init': 'Method for initialization of centroids.',
    'eps': 'Maximum distance between two samples to be considered as in the same neighborhood.',
    'min_samples': 'Minimum number of samples in a neighborhood to be considered a core point.',
    'n_components': 'Number of components to keep after dimensionality reduction.'
  };
  
  return descriptions[param] || 'No description available';
};

const getMetricDescription = (metric) => {
  const descriptions = {
    'accuracy': 'Percentage of correctly classified instances (higher is better).',
    'precision': 'Ratio of true positives to all predicted positives (higher is better).',
    'f1': 'Harmonic mean of precision and recall (higher is better).',
    'mae': 'Mean Absolute Error - average magnitude of errors (lower is better).',
    'mse': 'Mean Squared Error - average squared differences (lower is better).',
    'r2': 'R-squared - proportion of variance explained by the model (higher is better).',
    'inertia': 'Sum of squared distances to closest centroid (lower is better).',
    'n_clusters': 'Number of clusters identified.',
    'silhouette_score': 'Measure of how similar an object is to its own cluster compared to other clusters (higher is better).',
    'n_noise': 'Number of noise points (not assigned to any cluster).',
    'explained_variance_ratio': 'Proportion of variance explained by each component.',
    'n_components': 'Number of principal components kept.'
  };
  
  return descriptions[metric] || 'No description available';
};

// Create Model Dialog Component
const CreateModelDialog = ({ datasets, onClose, onModelCreated }) => {
  const [newModel, setNewModel] = useState({
    name: '',
    description: '',
    model_type: 'logistic_regression',
    task_type: 'classification',
    feature_columns: [],
    hyperparameters: {
      random_state: 42,
      C: 1.0,
      max_iter: 100
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModel(prev => ({ ...prev, [name]: value }));
    
    // When task type changes, adjust available model types
    if (name === 'task_type') {
      // Set appropriate default model type based on task
      let defaultModelType = 'logistic_regression';
      if (value === 'clustering') defaultModelType = 'kmeans';
      else if (value === 'dimensionality_reduction') defaultModelType = 'pca';
      
      setNewModel(prev => ({ 
        ...prev, 
        model_type: defaultModelType
      }));
    }
  };

  const handleHyperparameterChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    // Try to parse numeric values
    if (!isNaN(value) && value !== '') {
      parsedValue = Number(value);
    }
    
    setNewModel(prev => ({
      ...prev,
      hyperparameters: {
        ...prev.hyperparameters,
        [name]: parsedValue
      }
    }));
  };

  const handleCreateModel = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Validate required fields
      if (!newModel.name) {
        setError('Model name is required');
        setLoading(false);
        return;
      }
      
      // Log what we're about to send
      console.log('Creating model with data:', newModel);
      
      const response = await axios.post(
        `${API_URL}/models/`,
        newModel,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Model created successfully:', response.data);
      onModelCreated(response.data);
    } catch (err) {
      console.error('Error creating model:', err);
      setError(err.response?.data?.detail || 'Failed to create model');
    } finally {
      setLoading(false);
    }
  };

  // Get available model types based on task type
  const getAvailableModelTypes = () => {
    switch(newModel.task_type) {
      case 'classification':
        return [
          { value: 'logistic_regression', label: 'Logistic Regression' },
          { value: 'svm', label: 'Support Vector Machine' },
          { value: 'neural_network', label: 'Neural Network' }
        ];
      case 'regression':
        return [
          { value: 'svr', label: 'Support Vector Regression' },
          { value: 'neural_network', label: 'Neural Network' }
        ];
      case 'clustering':
        return [
          { value: 'kmeans', label: 'K-Means' },
          { value: 'dbscan', label: 'DBSCAN' }
        ];
      case 'dimensionality_reduction':
        return [
          { value: 'pca', label: 'Principal Component Analysis' }
        ];
      default:
        return [];
    }
  };
  
  // Get hyperparameter form based on model type
  const renderHyperparameterForm = () => {
    switch(newModel.model_type) {
      case 'logistic_regression':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="C (Regularization)"
                name="C"
                type="number"
                value={newModel.hyperparameters.C || 1.0}
                onChange={handleHyperparameterChange}
                fullWidth
                helperText="Lower values = stronger regularization"
                inputProps={{ step: 0.1, min: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Penalty</InputLabel>
                <Select
                  name="penalty"
                  value={newModel.hyperparameters.penalty || 'l2'}
                  onChange={handleHyperparameterChange}
                  label="Penalty"
                >
                  <MenuItem value="l1">L1</MenuItem>
                  <MenuItem value="l2">L2</MenuItem>
                  <MenuItem value="elasticnet">ElasticNet</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Max Iterations"
                name="max_iter"
                type="number"
                value={newModel.hyperparameters.max_iter || 100}
                onChange={handleHyperparameterChange}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Grid>
          </>
        );
      
      case 'svm':
      case 'svr':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="C (Regularization)"
                name="C"
                type="number"
                value={newModel.hyperparameters.C || 1.0}
                onChange={handleHyperparameterChange}
                fullWidth
                helperText="Lower values = stronger regularization"
                inputProps={{ step: 0.1, min: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Kernel</InputLabel>
                <Select
                  name="kernel"
                  value={newModel.hyperparameters.kernel || 'rbf'}
                  onChange={handleHyperparameterChange}
                  label="Kernel"
                >
                  <MenuItem value="linear">Linear</MenuItem>
                  <MenuItem value="poly">Polynomial</MenuItem>
                  <MenuItem value="rbf">RBF</MenuItem>
                  <MenuItem value="sigmoid">Sigmoid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gamma</InputLabel>
                <Select
                  name="gamma"
                  value={newModel.hyperparameters.gamma || 'scale'}
                  onChange={handleHyperparameterChange}
                  label="Gamma"
                >
                  <MenuItem value="scale">Scale</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
        );
        
      case 'neural_network':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Hidden Layer Size"
                name="hidden_layer_sizes"
                value={
                  Array.isArray(newModel.hyperparameters.hidden_layer_sizes)
                    ? newModel.hyperparameters.hidden_layer_sizes.join(',')
                    : '100'
                }
                onChange={(e) => {
                  const sizes = e.target.value.split(',').map(s => parseInt(s.trim()));
                  handleHyperparameterChange({
                    target: { name: 'hidden_layer_sizes', value: sizes }
                  });
                }}
                fullWidth
                helperText="Comma separated values, e.g. 100,50,25"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Activation</InputLabel>
                <Select
                  name="activation"
                  value={newModel.hyperparameters.activation || 'relu'}
                  onChange={handleHyperparameterChange}
                  label="Activation"
                >
                  <MenuItem value="identity">Identity</MenuItem>
                  <MenuItem value="logistic">Logistic</MenuItem>
                  <MenuItem value="tanh">Tanh</MenuItem>
                  <MenuItem value="relu">ReLU</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Learning Rate Initial"
                name="learning_rate_init"
                type="number"
                value={newModel.hyperparameters.learning_rate_init || 0.001}
                onChange={handleHyperparameterChange}
                fullWidth
                inputProps={{ step: 0.001, min: 0.0001 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Max Iterations"
                name="max_iter"
                type="number"
                value={newModel.hyperparameters.max_iter || 200}
                onChange={handleHyperparameterChange}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Grid>
          </>
        );
        
      case 'kmeans':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Number of Clusters"
                name="n_clusters"
                type="number"
                value={newModel.hyperparameters.n_clusters || 8}
                onChange={handleHyperparameterChange}
                fullWidth
                inputProps={{ min: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Initialization Method</InputLabel>
                <Select
                  name="init"
                  value={newModel.hyperparameters.init || 'k-means++'}
                  onChange={handleHyperparameterChange}
                  label="Initialization Method"
                >
                  <MenuItem value="k-means++">k-means++</MenuItem>
                  <MenuItem value="random">Random</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
        );
        
      case 'dbscan':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Epsilon (eps)"
                name="eps"
                type="number"
                value={newModel.hyperparameters.eps || 0.5}
                onChange={handleHyperparameterChange}
                fullWidth
                helperText="Maximum distance between points in a cluster"
                inputProps={{ step: 0.1, min: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Min Samples"
                name="min_samples"
                type="number"
                value={newModel.hyperparameters.min_samples || 5}
                onChange={handleHyperparameterChange}
                fullWidth
                helperText="Minimum points to form a dense region"
                inputProps={{ min: 1 }}
              />
            </Grid>
          </>
        );
        
      case 'pca':
        return (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                label="Number of Components"
                name="n_components"
                type="number"
                value={newModel.hyperparameters.n_components || 2}
                onChange={handleHyperparameterChange}
                fullWidth
                helperText="Number of components to keep"
                inputProps={{ min: 1 }}
              />
            </Grid>
          </>
        );
        
      default:
        return <Grid item xs={12}><Typography>No configurable hyperparameters</Typography></Grid>;
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
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Basic Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Model Name"
              name="name"
              value={newModel.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Description (Optional)"
              name="description"
              value={newModel.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={1}
            />
          </Grid>
          
          {/* Model Configuration */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Model Configuration
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Task Type</InputLabel>
              <Select
                name="task_type"
                value={newModel.task_type}
                onChange={handleInputChange}
                label="Task Type"
              >
                <MenuItem value="classification">Classification</MenuItem>
                <MenuItem value="regression">Regression</MenuItem>
                <MenuItem value="clustering">Clustering</MenuItem>
                <MenuItem value="dimensionality_reduction">Dimensionality Reduction</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Model Type</InputLabel>
              <Select
                name="model_type"
                value={newModel.model_type}
                onChange={handleInputChange}
                label="Model Type"
              >
                {getAvailableModelTypes().map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Hyperparameters */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
              Hyperparameters
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Random State (Seed)"
              name="random_state"
              type="number"
              value={newModel.hyperparameters.random_state || 42}
              onChange={handleHyperparameterChange}
              fullWidth
              helperText="For reproducible results"
              inputProps={{ min: 0 }}
            />
          </Grid>
          
          {renderHyperparameterForm()}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleCreateModel}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} /> : null}
        >
          {loading ? 'Creating...' : 'Create Model'}
        </Button>
      </DialogActions>
    </>
  );
};

const ModelsPage = () => {
  debugLog("Rendering ModelsPage component");
  
  const navigate = useNavigate();
  const [createModelOpen, setCreateModelOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Fetch models on component mount
  useEffect(() => {
    debugLog("ModelsPage useEffect triggered");
    fetchModels();
    fetchDatasets();
  }, []);

  const fetchModels = async () => {
    debugLog("Fetching models...");
    setLoading(true);
    setError(null);
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
      
      debugLog("API response:", response.data);
      setModels(response.data);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError('Failed to load models. Please try again later.');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasets = async () => {
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
      
      setDatasets(response.data);
    } catch (err) {
      console.error('Error fetching datasets:', err);
    }
  };

  const handleCreateModel = () => {
    setCreateModelOpen(true);
  };

  const handleViewDetails = useCallback(async (modelId) => {
    debugLog("Viewing details for model ID:", modelId);
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/models/${modelId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSelectedModel(response.data);
      setDetailsOpen(true);
    } catch (err) {
      console.error('Error fetching model details:', err);
      setSnackbarMessage('Failed to load model details');
      setOpenSnackbar(true);
    }
  }, [navigate]);

  const handleDeleteModel = useCallback(async (modelId) => {
    if (!window.confirm('Are you sure you want to delete this model?')) {
      return;
    }
    
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`${API_URL}/models/${modelId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove from local state
      setModels(prevModels => prevModels.filter(model => model.id !== modelId));
      setSnackbarMessage('Model deleted successfully');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error deleting model:', err);
      setSnackbarMessage('Failed to delete model');
      setOpenSnackbar(true);
    }
  }, [navigate]);

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  // Get appropriate chip color based on task type
  const getTaskTypeColor = (taskType) => {
    switch(taskType) {
      case 'classification': return 'primary';
      case 'regression': return 'secondary';
      case 'clustering': return 'success';
      case 'dimensionality_reduction': return 'info';
      default: return 'default';
    }
  };

  // Get formatted model type display name
  const getModelTypeDisplay = (modelType) => {
    switch(modelType) {
      case 'logistic_regression': return 'Logistic Regression';
      case 'svm': return 'SVM';
      case 'neural_network': return 'Neural Network';
      case 'svr': return 'SVR';
      case 'kmeans': return 'K-Means';
      case 'dbscan': return 'DBSCAN';
      case 'pca': return 'PCA';
      default: return modelType;
    }
  };

  return (
    <>
      {/* Main interface header with buttons */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Models
          </Typography>
          <Box>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateModel}
              sx={{ px: 3 }}
            >
              Create New Model
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
      
      {/* Models table */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ mr: 2 }} />
            <Typography>Loading models...</Typography>
          </Box>
        ) : models.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No models found.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateModel}
              sx={{ mt: 2 }}
            >
              Create Your First Model
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">ID</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Type</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Task</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>{model.id}</TableCell>
                    <TableCell>{model.name}</TableCell>
                    <TableCell>{getModelTypeDisplay(model.model_type)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={model.task_type} 
                        size="small"
                        color={getTaskTypeColor(model.task_type)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleViewDetails(model.id)}
                          title="View Details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteModel(model.id)}
                          title="Delete Model"
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

      {/* Create Model Dialog */}
      <Dialog 
        open={createModelOpen} 
        onClose={() => setCreateModelOpen(false)} 
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Create New Model</Typography>
        </DialogTitle>
        <CreateModelDialog 
          datasets={datasets} 
          onClose={() => setCreateModelOpen(false)}
          onModelCreated={(newModel) => {
            setModels(prevModels => [...prevModels, newModel]);
            setCreateModelOpen(false);
            setSnackbarMessage('Model created successfully');
            setOpenSnackbar(true);
          }}
        />
      </Dialog>
      
      {/* Model Details Dialog */}
      {selectedModel && (
        <Dialog 
          open={detailsOpen} 
          onClose={() => setDetailsOpen(false)} 
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedModel.name}</Typography>
              <Box>
                <Chip 
                  icon={<TuneIcon />}
                  label={getModelTypeDisplay(selectedModel.model_type)}
                  size="small" 
                  sx={{ mr: 1 }} 
                />
                <Chip 
                  icon={<SettingsIcon />}
                  label={selectedModel.task_type} 
                  color={getTaskTypeColor(selectedModel.task_type)}
                  size="small" 
                />
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="model tabs">
                <Tab label="Overview" />
                <Tab label="Hyperparameters" />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Basic Information
                      </Typography>
                      <Typography variant="body2">
                        <strong>Model ID:</strong> {selectedModel.id}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Created:</strong> {new Date(selectedModel.created_at).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Description:</strong> {selectedModel.description || "No description provided"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Model Hyperparameters
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Parameter</strong></TableCell>
                              <TableCell><strong>Value</strong></TableCell>
                              <TableCell><strong>Description</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(selectedModel.hyperparameters || {})
                              .filter(([key, _]) => {
                                // Always show random_state
                                if (key === 'random_state') return true;
                                
                                // Filter parameters based on model type
                                switch(selectedModel.model_type) {
                                  case 'logistic_regression':
                                    return ['C', 'penalty', 'solver', 'max_iter'].includes(key);
                                  case 'svm':
                                  case 'svr':
                                    return ['C', 'kernel', 'gamma'].includes(key);
                                  case 'neural_network':
                                    return ['hidden_layer_sizes', 'activation', 'learning_rate', 'learning_rate_init', 'max_iter'].includes(key);
                                  case 'kmeans':
                                    return ['n_clusters', 'init'].includes(key);
                                  case 'dbscan':
                                    return ['eps', 'min_samples'].includes(key);
                                  case 'pca':
                                    return ['n_components'].includes(key);
                                  default:
                                    return true;
                                }
                              })
                              .map(([key, value]) => (
                                <TableRow key={key}>
                                  <TableCell>{key}</TableCell>
                                  <TableCell>
                                    {Array.isArray(value) 
                                      ? JSON.stringify(value) 
                                      : typeof value === 'object' 
                                        ? JSON.stringify(value) 
                                        : String(value)
                                    }
                                  </TableCell>
                                  <TableCell>{getHyperparameterDescription(key)}</TableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                      </TableContainer>
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

export default ModelsPage; 