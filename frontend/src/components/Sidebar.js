import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StorageIcon from '@mui/icons-material/Storage';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AddIcon from '@mui/icons-material/Add';

const drawerWidth = 280;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
  '&.active .MuiListItemButton-root': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    '& .MuiListItemIcon-root': {
      color: theme.palette.common.white,
    },
  },
}));

const Sidebar = () => {
  const menuItems = [
    { 
      text: 'Jobs', 
      icon: <AssignmentIcon />, 
      path: '/dashboard/jobs',
      description: 'A table of jobs'
    },
    { 
      text: 'Datasets', 
      icon: <StorageIcon />, 
      path: '/dashboard/datasets',
      description: 'A table of datasets'
    },
    { 
      text: 'Models', 
      icon: <ModelTrainingIcon />, 
      path: '/dashboard/models',
      description: 'A table of hyperparameters'
    },
    { 
      text: 'API Keys', 
      icon: <VpnKeyIcon />, 
      path: '/dashboard/api-keys',
      description: 'A table of API keys'
    },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>P</Avatar>
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          PackageML
        </Typography>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <ListItemButton
          component={NavLink}
          to="/dashboard/new"
          sx={{
            bgcolor: 'secondary.main',
            color: 'white',
            borderRadius: 2,
            mb: 1,
            '&:hover': {
              bgcolor: 'secondary.dark',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="+ New" />
        </ListItemButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledNavLink to={item.path}>
              <ListItemButton sx={{ py: 1.5, borderRadius: 1, mx: 1 }}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  secondary={item.description}
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              </ListItemButton>
            </StyledNavLink>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 