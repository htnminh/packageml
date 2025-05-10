import React, { useEffect, useCallback } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StorageIcon from '@mui/icons-material/Storage';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

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

const IconWrapper = styled(Box)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  borderRadius: '50%',
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  marginBottom: theme.spacing(2),
}));

const NewItemCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const NewItemPage = () => {
  debugLog("Rendering NewItemPage component");
  
  const navigate = useNavigate();
  
  useEffect(() => {
    debugLog("NewItemPage component mounted");
  }, []);
  
  const items = [
    { 
      title: 'Create something new', 
      description: 'Start a new ML project with AutoML or manual selection.',
      icon: <AssignmentIcon fontSize="large" />,
      color: '#3f51b5',
      path: '/dashboard/jobs/new'
    },
    { 
      title: 'Upload a dataset', 
      description: 'Add a new dataset to use in your ML projects.',
      icon: <StorageIcon fontSize="large" />,
      color: '#00a152',
      path: '/dashboard/datasets/new'
    },
    { 
      title: 'Configure hyperparameters', 
      description: 'Create custom model configurations.',
      icon: <ModelTrainingIcon fontSize="large" />,
      color: '#f50057',
      path: '/dashboard/models/new'
    },
    { 
      title: 'Generate API key', 
      description: 'Create new API keys for integration.',
      icon: <VpnKeyIcon fontSize="large" />,
      color: '#ff9800',
      path: '/dashboard/api-keys/new'
    }
  ];

  const handleNavigate = useCallback((path) => {
    debugLog("Navigating to:", path);
    navigate(path);
  }, [navigate]);

  const handleBackNavigation = useCallback(() => {
    debugLog("Navigating back to dashboard");
    navigate('/dashboard');
  }, [navigate]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackNavigation}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Create New
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <NewItemCard>
              <CardActionArea 
                sx={{ height: '100%', p: 2 }}
                onClick={() => handleNavigate(item.path)}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <IconWrapper color={item.color}>
                    {item.icon}
                  </IconWrapper>
                  <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </NewItemCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default NewItemPage; 