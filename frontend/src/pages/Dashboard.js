import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, Toolbar, Typography, Grid, Paper, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import JobsPage from './dashboard/JobsPage';
import DatasetsPage from './dashboard/DatasetsPage';
import ModelsPage from './dashboard/ModelsPage';
import ApiKeysPage from './dashboard/ApiKeysPage';
import NewItemPage from './dashboard/NewItemPage';
import AddIcon from '@mui/icons-material/Add';

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header />
        <Toolbar /> {/* Adds space below app bar */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/datasets" element={<DatasetsPage />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
            <Route path="/new" element={<NewItemPage />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

const DashboardCard = ({ title, count, bgColor, icon, buttonText }) => {
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
        <Button variant="text" color="primary" sx={{ fontWeight: 'medium' }}>
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );
};

const DashboardHome = () => {
  // Placeholder stats - in a real app these would come from API
  const stats = [
    { title: 'Active Jobs', count: '12', buttonText: 'View Jobs', bgColor: '#3f51b5' },
    { title: 'Datasets', count: '24', buttonText: 'Manage Datasets', bgColor: '#00a152' },
    { title: 'Models', count: '8', buttonText: 'View Models', bgColor: '#f50057' },
    { title: 'API Calls', count: '872', buttonText: 'View Stats', bgColor: '#ff9800' },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
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

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Recent Jobs
        </Typography>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary" textAlign="center" py={6}>
            No recent jobs found. Start by creating a new job.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              Create New Job
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Dashboard; 