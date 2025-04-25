import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const JobsPage = () => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Jobs
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
          Create New Job
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="body1" color="text.secondary" textAlign="center" py={6}>
          Your training jobs will appear here.
        </Typography>
      </Paper>
    </>
  );
};

export default JobsPage; 