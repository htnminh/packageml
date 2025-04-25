import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  IconButton, 
  Toolbar, 
  Typography,
  useMediaQuery 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LoginIcon from '@mui/icons-material/Login';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import ApiIcon from '@mui/icons-material/Api';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '85vh',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(10, 0),
  background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.9) 0%, rgba(100, 120, 240, 0.85) 100%)',
  color: theme.palette.common.white,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const LandingPage = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <>
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', bgcolor: 'rgba(255, 255, 255, 0.8)' }}>
        <Container>
          <Toolbar disableGutters>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
              PackageML
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button color="inherit" startIcon={<DownloadIcon />}>Download</Button>
              <Button color="inherit" startIcon={<MenuBookIcon />}>Documentation</Button>
              <Button 
                component={Link} 
                to="/dashboard" 
                variant="contained" 
                color="primary" 
                startIcon={<LoginIcon />}
              >
                Log In
              </Button>
            </Box>
            {isMobile && (
              <IconButton edge="end" color="inherit" aria-label="menu">
                <LoginIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <HeroSection>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                No-Code ML Platform for Everyone
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Turn raw data into actionable insights without coding or expensive infrastructure.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  color="secondary" 
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
                <Button 
                  component={Link}
                  to="/dashboard"
                  variant="outlined" 
                  size="large" 
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderColor: 'white' }}
                  startIcon={<LoginIcon />}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img" 
                src="/platform-preview.png" 
                alt="PackageML Platform Preview"
                sx={{ 
                  width: '100%', 
                  maxWidth: 600, 
                  borderRadius: 4, 
                  boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
                  display: { xs: 'none', md: 'block' },
                  mx: 'auto'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Title
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            Description
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CodeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    No-Code ML
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Train models without writing a single line of code through our intuitive interface.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <StorageIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Dataset Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload, validate, and organize your datasets with ease.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <BarChartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Visual Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get clear visualizations and explanations of your model's performance.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <ApiIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    API Integration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect your models to other tools via our MCP API integration.
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage; 