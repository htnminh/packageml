import React, { useState } from 'react';
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
  Tabs
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import TableChartIcon from '@mui/icons-material/TableChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';

// Mock data for datasets
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

// Mock dataset details
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
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleViewDetails = (datasetId) => {
    // In a real application, this would fetch the dataset details
    setSelectedDataset(mockDatasetDetails);
    setDetailsOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Datasets
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/dashboard/new')}
        >
          Upload New Dataset
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {mockDatasets.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={6}>
            No datasets found. Upload a dataset to get started.
          </Typography>
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
                  <TableCell><Typography fontWeight="bold">Type</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Uploaded</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockDatasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>{dataset.name}</TableCell>
                    <TableCell>{dataset.filename}</TableCell>
                    <TableCell>{dataset.rows.toLocaleString()}</TableCell>
                    <TableCell>{dataset.columns}</TableCell>
                    <TableCell>{dataset.size}</TableCell>
                    <TableCell>
                      <Chip 
                        label={dataset.type} 
                        size="small"
                        color={dataset.type === 'CSV' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
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
                        <IconButton color="secondary" size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="default" size="small">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
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
                  label={`${mockDatasetDetails.sample_data.length} rows shown`} 
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
                      {mockDatasetDetails.sample_data.map((row, index) => (
                        <TableRow key={index}>
                          {selectedDataset.columns.map((column) => (
                            <TableCell key={column.name}>
                              {row[column.name]}
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
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Column Statistics</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Column</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Missing Values</TableCell>
                            <TableCell>Example</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedDataset.columns.map((column) => (
                            <TableRow key={column.name}>
                              <TableCell>{column.name}</TableCell>
                              <TableCell>
                                <Chip size="small" label={column.type} />
                              </TableCell>
                              <TableCell>
                                {column.missing === 0 ? (
                                  <Chip size="small" label="None" color="success" />
                                ) : (
                                  <Chip size="small" label={column.missing} color="warning" />
                                )}
                              </TableCell>
                              <TableCell>{column.example}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Dataset Information</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2">
                          <strong>Filename:</strong> {selectedDataset.filename}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Upload Date:</strong> {selectedDataset.created}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Description:</strong> {selectedDataset.description}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Tags:</strong>
                          </Typography>
                          <Box>
                            {selectedDataset.tags.map((tag) => (
                              <Chip key={tag} label={tag} size="small" sx={{ mr: 1 }} />
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Usage Information</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2">
                          <strong>Used in Jobs:</strong> {mockDatasets[0].used_in_jobs}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                          <strong>Last Used:</strong> 2023-06-01
                        </Typography>
                        <Button 
                          variant="outlined" 
                          color="primary"
                          size="small"
                          startIcon={<AddIcon />}
                        >
                          Create Job Using This Dataset
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            <Button startIcon={<DownloadIcon />} variant="outlined">Export Dataset</Button>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<AddIcon />}
            >
              Use in New Job
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default DatasetsPage; 