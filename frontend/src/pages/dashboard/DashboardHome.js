import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ApiIcon from '@mui/icons-material/Api';

const DashboardCard = ({ title, count, bgColor, icon, buttonText, linkTo }) => {
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
        {count}
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
  // Updated stats with the correct values
  const stats = [
    { 
      title: 'Jobs', 
      count: '12', 
      buttonText: 'View Jobs', 
      bgColor: '#3f51b5',
      icon: <ListAltIcon color="primary" />,
      linkTo: '/dashboard/jobs'
    },
    { 
      title: 'Datasets', 
      count: '24', 
      buttonText: 'Manage Datasets', 
      bgColor: '#00a152',
      icon: <StorageIcon color="success" />,
      linkTo: '/dashboard/datasets'
    },
    { 
      title: 'Models', 
      count: '8', 
      buttonText: 'View Models', 
      bgColor: '#f50057',
      icon: <BarChartIcon color="secondary" />,
      linkTo: '/dashboard/models'
    },
    { 
      title: 'API Calls', 
      count: '872', 
      buttonText: 'View Stats', 
      bgColor: '#ff9800',
      icon: <ApiIcon color="warning" />,
      linkTo: '/dashboard/api'
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
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

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default DashboardHome; 