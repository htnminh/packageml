import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ApiKeysPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch API keys when the component mounts
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/api-keys/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setApiKeys(response.data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setError('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setShowNewKey(false);
    setKeyName('');
    setExpiryDate(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGenerateKey = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const data = {
        name: keyName,
        expires_at: expiryDate ? expiryDate.toISOString() : null
      };

      const response = await axios.post(`${API_URL}/api-keys/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Set the new key to show in the dialog
      setNewKey(response.data.key);
      setShowNewKey(true);
      
      // Update the list of API keys
      fetchApiKeys();
    } catch (error) {
      console.error('Error generating API key:', error);
      setError('Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setNotification('API key copied to clipboard');
    setOpenSnackbar(true);
  };

  const handleRevokeKey = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`${API_URL}/api-keys/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the list of API keys
      fetchApiKeys();
      setNotification('API key revoked successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error revoking API key:', error);
      setError('Failed to revoke API key');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          API Keys
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpen}>
          Generate New Key
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {loading && apiKeys.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ mr: 2 }} />
            <Typography>Loading API keys...</Typography>
          </Box>
        ) : apiKeys.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={6}>
            You haven't created any API keys yet. API keys allow you to access PackageML programmatically.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">ID</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Key</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Created</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Expires</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Usage Count</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Last Used</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell>{apiKey.id}</TableCell>
                    <TableCell>{apiKey.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {apiKey.key.substring(0, 8)}...
                        </Typography>
                        <IconButton size="small" onClick={() => handleCopyKey(apiKey.key)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(apiKey.created_at)}</TableCell>
                    <TableCell>
                      {formatDate(apiKey.expires_at)}
                    </TableCell>
                    <TableCell>{apiKey.usage_count}</TableCell>
                    <TableCell>{apiKey.last_used_at ? formatDate(apiKey.last_used_at) : 'Never'}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRevokeKey(apiKey.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Generate Key Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Generate New API Key</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {!showNewKey ? (
            <Box sx={{ pt: 1 }}>
              <TextField
                label="Key Name"
                fullWidth
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                margin="normal"
                placeholder="e.g. Production API Key"
              />
              <Box sx={{ mt: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Expiry Date (Optional)"
                    value={expiryDate}
                    onChange={(newValue) => setExpiryDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This API key will provide access to all PackageML functionality through the API.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Your API Key Has Been Generated
              </Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(0, 0, 0, 0.04)', 
                borderRadius: 1, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between' 
              }}>
                <Typography variant="body2" fontFamily="monospace">
                  {newKey}
                </Typography>
                <IconButton size="small" onClick={() => handleCopyKey(newKey)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!showNewKey ? (
            <>
              <Button onClick={handleClose}>Cancel</Button>
              <Button 
                onClick={handleGenerateKey} 
                variant="contained" 
                color="primary"
                disabled={!keyName || loading}
              >
                {loading ? 'Generating...' : 'Generate Key'}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} variant="contained" color="primary">
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        message={notification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
};

export default ApiKeysPage; 