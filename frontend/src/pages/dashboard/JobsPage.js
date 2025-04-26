import React, { useState } from 'react';
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
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
const mockJobs = [
  { 
    id: 1, 
    name: 'Customer Churn Prediction', 
    dataset: 'customer_data.csv', 
    algorithm: 'Random Forest', 
    status: 'Completed', 
    progress: 100, 
    created: '2023-05-20', 
    completed: '2023-05-20',
    accuracy: '89.5%'
  },
  { 
    id: 2, 
    name: 'Sales Forecast', 
    dataset: 'sales_data.csv', 
    algorithm: 'XGBoost', 
    status: 'In Progress', 
    progress: 65, 
    created: '2023-06-05', 
    completed: null,
    accuracy: null
  },
  { 
    id: 3, 
    name: 'Product Recommendation', 
    dataset: 'user_transactions.csv', 
    algorithm: 'Auto-Select', 
    status: 'Failed', 
    progress: 30, 
    created: '2023-06-01', 
    completed: '2023-06-01',
    accuracy: null,
    error: 'Dataset validation failed: Missing values in target column'
  }
];

// Mock results data
const mockResults = {
  performance: {
    accuracy: 89.5,
    precision: 92.1,
    recall: 85.3,
    f1: 88.6
  },
  featureImportance: [
    { feature: 'Subscription Length', importance: 0.32 },
    { feature: 'Monthly Charges', importance: 0.28 },
    { feature: 'Total Charges', importance: 0.15 },
    { feature: 'Age', importance: 0.12 },
    { feature: 'Contract Type', importance: 0.08 },
    { feature: 'Payment Method', importance: 0.05 }
  ],
  confusionMatrix: [
    [150, 12],
    [25, 113]
  ]
};

const JobsPage = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewResults = (jobId) => {
    const job = mockJobs.find(j => j.id === jobId);
    setSelectedJob(job);
    setResultDialogOpen(true);
  };

  const getStatusChip = (status) => {
    let color;
    let icon;
    
    switch (status) {
      case 'Completed':
        color = 'success';
        break;
      case 'In Progress':
        color = 'info';
        break;
      case 'Failed':
        color = 'error';
        break;
      case 'Pending':
        color = 'warning';
        break;
      default:
        color = 'default';
    }
    
    return <Chip color={color} label={status} size="small" />;
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
          onClick={() => navigate('/dashboard/new')}
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
        {mockJobs.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={6}>
            No jobs found. Create a new job to start training a model.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Job Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Dataset</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Algorithm</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Progress</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Created</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.name}</TableCell>
                    <TableCell>{job.dataset}</TableCell>
                    <TableCell>{job.algorithm}</TableCell>
                    <TableCell>{getStatusChip(job.status)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 180 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={job.progress} 
                            color={job.status === 'Failed' ? 'error' : 'primary'}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">{`${Math.round(job.progress)}%`}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{job.created}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        {job.status === 'Completed' && (
                          <IconButton 
                            color="primary" 
                            onClick={() => handleViewResults(job.id)}
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        )}
                        {job.status === 'In Progress' && (
                          <IconButton color="warning" size="small">
                            <PauseIcon fontSize="small" />
                          </IconButton>
                        )}
                        {job.status === 'Failed' && (
                          <IconButton color="primary" size="small">
                            <PlayArrowIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton color="error" size="small">
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

      {/* Results Dialog */}
      {selectedJob && (
        <Dialog open={resultDialogOpen} onClose={() => setResultDialogOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Results: {selectedJob.name}</Typography>
              <Chip label={`Accuracy: ${selectedJob.accuracy || 'N/A'}`} color="success" />
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Tabs value={0} onChange={() => {}} aria-label="results tabs">
                <Tab label="Performance" />
                <Tab label="Feature Importance" />
                <Tab label="Explanations" />
                <Tab label="Predictions" />
              </Tabs>
            </Box>

            {/* Performance Section */}
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                      <Table size="small">
                        <TableBody>
                          {Object.entries(mockResults.performance).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell component="th" scope="row">
                                <Typography variant="body2" fontWeight="bold">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2">{value}%</Typography>
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
                      <Typography variant="h6" gutterBottom>Confusion Matrix</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center">Predicted: No</TableCell>
                                <TableCell align="center">Predicted: Yes</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell component="th" scope="row">Actual: No</TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                                  {mockResults.confusionMatrix[0][0]}
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
                                  {mockResults.confusionMatrix[0][1]}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">Actual: Yes</TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
                                  {mockResults.confusionMatrix[1][0]}
                                </TableCell>
                                <TableCell align="center" sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                                  {mockResults.confusionMatrix[1][1]}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Feature Importance</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Feature</TableCell>
                              <TableCell>Importance</TableCell>
                              <TableCell>Visualization</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mockResults.featureImportance.map((feature) => (
                              <TableRow key={feature.feature}>
                                <TableCell>{feature.feature}</TableCell>
                                <TableCell>{(feature.importance * 100).toFixed(1)}%</TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Box 
                                      sx={{ 
                                        bgcolor: 'primary.main', 
                                        height: 15, 
                                        borderRadius: 1,
                                        width: `${feature.importance * 100}%`
                                      }} 
                                    />
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResultDialogOpen(false)}>Close</Button>
            <Button variant="contained" color="primary">Export Results</Button>
            <Button variant="contained" color="secondary">Deploy Model</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default JobsPage; 