import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ApiIcon from '@mui/icons-material/Api';
import axios from 'axios';

// Backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const DashboardCard = ({ title, count, bgColor, icon, buttonText, linkTo, isLoading }) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: 170,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: bgColor,
          opacity: 0.1,
          borderRadius: '0 0 0 100%',
        }}
      />
      <Typography color="text.secondary" variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.primary" variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        {isLoading ? <CircularProgress size={36} /> : count}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        <Button 
          variant="text" 
          color="primary" 
          sx={{ fontWeight: 'medium' }}
          component={Link}
          to={linkTo}
        >
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );
};

const DashboardHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState([
    { 
      title: 'Jobs', 
      count: '0', 
      buttonText: 'View Jobs', 
      bgColor: '#3f51b5',
      icon: <ListAltIcon color="primary" />,
      linkTo: '/dashboard/jobs'
    },
    { 
      title: 'Datasets', 
      count: '0', 
      buttonText: 'Manage Datasets', 
      bgColor: '#00a152',
      icon: <StorageIcon color="success" />,
      linkTo: '/dashboard/datasets'
    },
    { 
      title: 'Models', 
      count: '0', 
      buttonText: 'View Models', 
      bgColor: '#f50057',
      icon: <BarChartIcon color="secondary" />,
      linkTo: '/dashboard/models'
    },
    { 
      title: 'API Calls', 
      count: '0', 
      buttonText: 'View Stats', 
      bgColor: '#ff9800',
      icon: <ApiIcon color="warning" />,
      linkTo: '/dashboard/api'
    },
  ]);

  // On first load, fetch the stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Fetch jobs count
      const jobsResponse = await axios.get(`${API_URL}/jobs/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch datasets count
      const datasetsResponse = await axios.get(`${API_URL}/datasets/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch models count
      const modelsResponse = await axios.get(`${API_URL}/models/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch API keys (as a proxy for API calls)
      const apiKeysResponse = await axios.get(`${API_URL}/api-keys/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Calculate total API usage by summing usage_count
      const totalApiCalls = apiKeysResponse.data.reduce(
        (total, key) => total + (key.usage_count || 0), 
        0
      );
      
      // Update stats with actual counts
      setStats(prev => [
        { ...prev[0], count: jobsResponse.data.length.toString() },
        { ...prev[1], count: datasetsResponse.data.length.toString() },
        { ...prev[2], count: modelsResponse.data.length.toString() },
        { ...prev[3], count: totalApiCalls.toString() }
      ]);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh stats">
            <IconButton 
              onClick={fetchStats} 
              disabled={isLoading}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/dashboard/new"
          >
            Create Something New
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard {...stat} isLoading={isLoading} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default DashboardHome; 