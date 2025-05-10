import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LoginIcon from '@mui/icons-material/Login';

const APIDocs = () => {
  return (
    <>
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', bgcolor: 'rgba(255, 255, 255, 0.8)' }}>
        <Container>
          <Toolbar disableGutters>
            <Typography 
              variant="h5" 
              component={Link} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold', 
                color: 'primary.main',
                textDecoration: 'none'
              }}
            >
              PackageML
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button 
                component={Link}
                to="/api-docs"
                color="inherit" 
                startIcon={<MenuBookIcon />}
              >
                Documentation
              </Button>
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                color="primary" 
                startIcon={<LoginIcon />}
              >
                Log In
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Box sx={{ pt: 10 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            PackageML API Documentation
          </Typography>

          <Paper sx={{ p: 4, my: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Authentication
            </Typography>
            <Typography variant="body1" paragraph>
              All API requests require an API key passed in the <code>Authorization</code> header.
            </Typography>
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace', mb: 3 }}>
              Authorization: Bearer YOUR_API_KEY
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Endpoints
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Datasets
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography fontWeight="bold">Method</Typography></TableCell>
                      <TableCell><Typography fontWeight="bold">Endpoint</Typography></TableCell>
                      <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/datasets/</TableCell>
                      <TableCell>List all datasets</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/datasets/{'{id}'}</TableCell>
                      <TableCell>Get dataset details</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/datasets/</TableCell>
                      <TableCell>Create dataset</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DELETE</TableCell>
                      <TableCell>/datasets/{'{id}'}</TableCell>
                      <TableCell>Delete dataset</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Models
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography fontWeight="bold">Method</Typography></TableCell>
                      <TableCell><Typography fontWeight="bold">Endpoint</Typography></TableCell>
                      <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/models/</TableCell>
                      <TableCell>List all models</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/models/{'{id}'}</TableCell>
                      <TableCell>Get model details</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/models/</TableCell>
                      <TableCell>Create new model</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PUT</TableCell>
                      <TableCell>/models/{'{id}'}</TableCell>
                      <TableCell>Update model</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DELETE</TableCell>
                      <TableCell>/models/{'{id}'}</TableCell>
                      <TableCell>Delete model</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/models/{'{id}'}/train</TableCell>
                      <TableCell>Train model</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Jobs
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography fontWeight="bold">Method</Typography></TableCell>
                      <TableCell><Typography fontWeight="bold">Endpoint</Typography></TableCell>
                      <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/jobs/</TableCell>
                      <TableCell>List all jobs</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/jobs/{'{id}'}</TableCell>
                      <TableCell>Get job details</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/jobs/</TableCell>
                      <TableCell>Create new job</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PUT</TableCell>
                      <TableCell>/jobs/{'{id}'}/start</TableCell>
                      <TableCell>Start pending job</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PUT</TableCell>
                      <TableCell>/jobs/{'{id}'}/cancel</TableCell>
                      <TableCell>Cancel job</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DELETE</TableCell>
                      <TableCell>/jobs/{'{id}'}</TableCell>
                      <TableCell>Delete job</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                API Keys
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography fontWeight="bold">Method</Typography></TableCell>
                      <TableCell><Typography fontWeight="bold">Endpoint</Typography></TableCell>
                      <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>GET</TableCell>
                      <TableCell>/api-keys/</TableCell>
                      <TableCell>List all API keys</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>POST</TableCell>
                      <TableCell>/api-keys/</TableCell>
                      <TableCell>Generate new API key</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DELETE</TableCell>
                      <TableCell>/api-keys/{'{id}'}</TableCell>
                      <TableCell>Revoke API key</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Model Types
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><Typography fontWeight="bold">Type</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Tasks</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>logistic_regression</TableCell>
                    <TableCell>Linear model for classification</TableCell>
                    <TableCell>classification</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>svm</TableCell>
                    <TableCell>Support Vector Machine</TableCell>
                    <TableCell>classification</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>svr</TableCell>
                    <TableCell>Support Vector Regression</TableCell>
                    <TableCell>regression</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>neural_network</TableCell>
                    <TableCell>Multi-layer Perceptron</TableCell>
                    <TableCell>classification, regression</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>kmeans</TableCell>
                    <TableCell>K-Means Clustering</TableCell>
                    <TableCell>clustering</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>dbscan</TableCell>
                    <TableCell>Density-Based Spatial Clustering</TableCell>
                    <TableCell>clustering</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>pca</TableCell>
                    <TableCell>Principal Component Analysis</TableCell>
                    <TableCell>dimensionality_reduction</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default APIDocs; 