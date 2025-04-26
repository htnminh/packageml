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
  useMediaQuery, 
  Divider,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TuneIcon from '@mui/icons-material/Tune';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getPlatformPreviewImage, getDashboardPreviewImage } from '../components/PlaceholderImages';

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

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(1),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: theme.palette.secondary.main,
  },
}));

const UseCaseCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  position: 'relative',
  '&:before': {
    content: '"""',
    position: 'absolute',
    top: 10,
    left: 20,
    fontSize: 60,
    color: theme.palette.primary.light,
    opacity: 0.3,
  },
}));

const LandingPage = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
  // Generate placeholder images
  const platformPreviewImage = getPlatformPreviewImage();
  const dashboardPreviewImage = getDashboardPreviewImage();

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
              <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<DownloadIcon />} 
                  label="Self-Hosted" 
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} 
                />
                <Chip 
                  icon={<CodeIcon />} 
                  label="No-Code Required" 
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} 
                />
                <Chip 
                  icon={<AutoAwesomeIcon />} 
                  label="One-Click Deployment" 
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img" 
                src={platformPreviewImage}
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

      {/* Core Features Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Features Built For You
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            PackageML brings machine learning capabilities to everyone without needing coding skills or expensive infrastructure
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

      {/* Advanced Features Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <SectionTitle variant="h3" fontWeight="bold" gutterBottom>
                Advanced Features At Your Fingertips
              </SectionTitle>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                PackageML combines powerful machine learning capabilities with ease of use, all in a lightweight, self-hosted package.
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Auto-select best algorithms" 
                    secondary="Let PackageML choose the optimal algorithm based on your data"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Experiment History & Versioning" 
                    secondary="Track all your runs with dataset versions, algorithm parameters, and metrics"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Model-Context-Protocol (MCP) Server" 
                    secondary="Stream predictions with full provenance directly to your applications"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Plain-language Explanations" 
                    secondary="Understand model decisions with clear natural language summaries"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img" 
                src={dashboardPreviewImage}
                alt="PackageML Dashboard"
                sx={{ 
                  width: '100%', 
                  maxWidth: 600, 
                  borderRadius: 4, 
                  boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
                  mx: 'auto'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            A simple, four-step process from data to insights
          </Typography>
          
          <Stepper alternativeLabel sx={{ mb: 8 }}>
            <Step active>
              <StepLabel StepIconComponent={() => <Avatar sx={{ bgcolor: 'primary.main' }}><CloudUploadIcon /></Avatar>}>
                <Typography variant="h6" sx={{ mt: 1 }}>Upload Data</Typography>
                <Typography variant="body2" color="text.secondary">Import CSV/Excel/JSON files via web or API</Typography>
              </StepLabel>
            </Step>
            <Step active>
              <StepLabel StepIconComponent={() => <Avatar sx={{ bgcolor: 'primary.main' }}><TuneIcon /></Avatar>}>
                <Typography variant="h6" sx={{ mt: 1 }}>Select Algorithm</Typography>
                <Typography variant="body2" color="text.secondary">Choose manually or let PackageML decide</Typography>
              </StepLabel>
            </Step>
            <Step active>
              <StepLabel StepIconComponent={() => <Avatar sx={{ bgcolor: 'primary.main' }}><ShowChartIcon /></Avatar>}>
                <Typography variant="h6" sx={{ mt: 1 }}>Train & Visualize</Typography>
                <Typography variant="body2" color="text.secondary">Get insights with charts and explanations</Typography>
              </StepLabel>
            </Step>
            <Step active>
              <StepLabel StepIconComponent={() => <Avatar sx={{ bgcolor: 'primary.main' }}><IntegrationInstructionsIcon /></Avatar>}>
                <Typography variant="h6" sx={{ mt: 1 }}>Deploy & Integrate</Typography>
                <Typography variant="body2" color="text.secondary">Use REST API to integrate with your tools</Typography>
              </StepLabel>
            </Step>
          </Stepper>
          
          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              endIcon={<ArrowForwardIcon />}
              component={Link}
              to="/dashboard"
            >
              Start Your First Project
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Use Cases Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Who Benefits from PackageML
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
            See how different organizations use our platform to solve real problems
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <UseCaseCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <SchoolIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">Educators</Typography>
                </Box>
                <Typography paragraph>
                  Help students understand machine learning concepts without the complexity of programming. Concentrate on teaching principles while PackageML handles infrastructure.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Teach data science without coding prerequisites" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Visualize model performance for better understanding" />
                  </ListItem>
                </List>
              </UseCaseCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <UseCaseCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <VolunteerActivismIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">NGOs</Typography>
                </Box>
                <Typography paragraph>
                  Analyze program outcomes and optimize resource allocation without expensive data science staff. Draw insights from field data with minimal technical barriers.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Predict program outcomes with limited resources" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Easy integration with existing workflow tools" />
                  </ListItem>
                </List>
              </UseCaseCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <UseCaseCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">Small Businesses</Typography>
                </Box>
                <Typography paragraph>
                  Unlock insights from customer data and optimize operations without hiring expensive data scientists. Self-host on affordable infrastructure.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Customer segmentation and sales forecasting" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Secure deployment on your own servers" />
                  </ListItem>
                </List>
              </UseCaseCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Technical Highlights */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <SectionTitle variant="h4" fontWeight="bold" gutterBottom>
                Technical Highlights
              </SectionTitle>
              <Typography variant="body1" paragraph>
                PackageML is built with performance and ease of deployment in mind, designed to run on modest hardware.
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">8GB</Typography>
                    <Typography variant="body2">Minimum RAM</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">4</Typography>
                    <Typography variant="body2">vCPUs Recommended</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">1</Typography>
                    <Typography variant="body2">Docker Compose File</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">GPL</Typography>
                    <Typography variant="body2">Open Source License</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box 
                component="img"
                src={dashboardPreviewImage}
                alt="PackageML Interface"
                sx={{
                  width: '100%',
                  maxWidth: 500,
                  borderRadius: 4,
                  boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, bgcolor: 'primary.main', color: 'white' }}>
        <Container>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Ready to Start Your ML Journey?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Use PackageML today and transform your data into actionable insights
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  color="secondary" 
                  startIcon={<DownloadIcon />}
                >
                  Download Now
                </Button>
                <Button 
                  component={Link}
                  to="/dashboard"
                  variant="outlined" 
                  size="large" 
                  sx={{ color: 'white', borderColor: 'white' }}
                  startIcon={<LoginIcon />}
                >
                  Sign Up
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: 'grey.900', color: 'grey.300' }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                PackageML
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Democratizing machine learning for everyone with a lightweight, no-code platform.
              </Typography>
              <Typography variant="body2">
                Released under GNU GPL v3 License
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Dashboard
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link to="#" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Documentation
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link to="#" style={{ color: 'inherit', textDecoration: 'none' }}>
                    GitHub Repository
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" paragraph>
                Have questions or need help? Reach out to our community.
              </Typography>
              <Button variant="outlined" size="small" sx={{ color: 'grey.300', borderColor: 'grey.300' }}>
                Join Discord
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, bgcolor: 'grey.800' }} />
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} PackageML. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage; 