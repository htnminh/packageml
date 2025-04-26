import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';

// Mock data for demonstration
const mockApiKeys = [
  { id: 1, name: 'Production API Key', key: 'pk_live_1234567890abcdef', created: '2023-05-15', expires: '2024-05-15', lastUsed: '2023-06-10' },
  { id: 2, name: 'Testing API Key', key: 'pk_test_abcdef1234567890', created: '2023-06-01', expires: '2023-12-01', lastUsed: '2023-06-08' }
];

const ApiKeysPage = () => {
  const [open, setOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [apiKeys, setApiKeys] = useState(mockApiKeys);

  const handleOpen = () => {
    setOpen(true);
    setShowNewKey(false);
    setKeyName('');
    setExpiryDate(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGenerateKey = () => {
    // In a real application, this would make an API call
    const generatedKey = 'pk_' + Math.random().toString(36).substring(2, 15);
    setNewKey(generatedKey);
    setShowNewKey(true);
    
    // Add the new key to the list
    const newKeyObject = {
      id: apiKeys.length + 1,
      name: keyName,
      key: generatedKey,
      created: format(new Date(), 'yyyy-MM-dd'),
      expires: expiryDate ? format(expiryDate, 'yyyy-MM-dd') : 'Never',
      lastUsed: '-'
    };
    
    setApiKeys([...apiKeys, newKeyObject]);
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    // In a real app, you would show a notification/toast here
  };

  const handleRevokeKey = (id) => {
    // In a real application, this would make an API call
    setApiKeys(apiKeys.filter(key => key.id !== id));
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
        {apiKeys.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={6}>
            You haven't created any API keys yet. API keys allow you to access PackageML programmatically.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Key</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Created</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Expires</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Last Used</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
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
                    <TableCell>{apiKey.created}</TableCell>
                    <TableCell>
                      {apiKey.expires === 'Never' ? (
                        'Never'
                      ) : (
                        <Chip 
                          label={apiKey.expires} 
                          color={new Date(apiKey.expires) < new Date() ? 'error' : 'default'} 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell>{apiKey.lastUsed}</TableCell>
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
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                For security reasons, this key will never be displayed again. Please copy it now.
              </Typography>
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
                disabled={!keyName}
              >
                Generate Key
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} variant="contained" color="primary">
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApiKeysPage; 