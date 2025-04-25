import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const DatasetsPage = () => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Datasets
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
          Upload New Dataset
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="body1" color="text.secondary" textAlign="center" py={6}>
          Your datasets will appear here.
        </Typography>
      </Paper>
    </>
  );
};

export default DatasetsPage; 