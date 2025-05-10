import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import ApiIcon from '@mui/icons-material/Api';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';

// Import dashboard page components
import DatasetsPage from './dashboard/DatasetsPage';
import NewDatasetPage from './dashboard/NewDatasetPage';
import ModelsPage from './dashboard/ModelsPage';
import JobsPage from './dashboard/JobsPage';
import ApiKeysPage from './dashboard/ApiKeysPage';
import NewItemPage from './dashboard/NewItemPage';
import DashboardHome from './dashboard/DashboardHome';

const drawerWidth = 240;

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Menu
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/datasets">
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="Datasets" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/models">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Models" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/jobs">
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="Jobs" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/api">
          <ListItemIcon>
            <ApiIcon />
          </ListItemIcon>
          <ListItemText primary="API Keys" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to="/dashboard/new">
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create New" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              color: 'white', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            PackageML
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.email || 'User'}
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/datasets" element={<DatasetsPage />} />
            <Route path="/datasets/new" element={<NewDatasetPage />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/api" element={<ApiKeysPage />} />
            <Route path="/new" element={<NewItemPage />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard; 