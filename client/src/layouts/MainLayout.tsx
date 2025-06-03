import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useScrollTrigger,
  Slide,
  Fab,
  useTheme,
  alpha,
  CssBaseline,
  Badge,
  Snackbar,
  Alert,
  Stack,
  Collapse,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  DirectionsCar as DirectionsCarIcon,
  BookOnline as BookOnlineIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Hide AppBar on scroll down
interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Scroll to top button
function ScrollTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        <Fab
          color="primary"
          size="small"
          aria-label="scroll back to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
}

interface NavLink {
  title: string;
  path: string;
  icon?: React.ReactElement;
}

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading, logout } = useAuth();
  
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [isHomePage, setIsHomePage] = useState(false);
  
  // Check if current page is homepage
  useEffect(() => {
    setIsHomePage(location.pathname === '/');
  }, [location]);

  // Navigation links
  const navLinks: NavLink[] = [
    { title: 'Home', path: '/' },
    { title: 'Cars', path: '/cars', icon: <DirectionsCarIcon /> },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' }
  ];

  // User menu items
  const userMenuItems = currentUser ? [
    { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { title: 'My Bookings', path: '/dashboard/bookings', icon: <BookOnlineIcon /> },
    { title: 'Favorites', path: '/dashboard/favorites', icon: <FavoriteIcon /> },
    { title: 'Profile', path: '/dashboard/profile', icon: <PersonIcon /> }
  ] : [];

  // Handle opening navigation menu (mobile)
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  // Handle opening user menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  // Handle closing navigation menu
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Handle closing user menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Toggle mobile drawer
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Handle user menu item click
  const handleUserMenuItemClick = (path: string) => {
    handleCloseUserMenu();
    navigate(path);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      handleCloseUserMenu();
      setNotification({
        open: true,
        message: 'You have been logged out successfully',
        severity: 'success'
      });
      navigate('/');
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to log out',
        severity: 'error'
      });
    }
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Render mobile drawer
  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      PaperProps={{
        sx: {
          width: 280,
          background: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
          DUBAI LUXURY CARS
        </Typography>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.title} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              selected={location.pathname === link.path}
              onClick={toggleMobileDrawer}
            >
              {link.icon && <Box sx={{ mr: 2 }}>{link.icon}</Box>}
              <ListItemText primary={link.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {currentUser ? (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Account
            </Typography>
          </Box>
          <List>
            {userMenuItems.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  onClick={toggleMobileDrawer}
                >
                  {item.icon && <Box sx={{ mr: 2 }}>{item.icon}</Box>}
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <Box sx={{ mr: 2 }}><LogoutIcon /></Box>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      ) : (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
            startIcon={<LoginIcon />}
            onClick={toggleMobileDrawer}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            component={Link}
            to="/register"
            startIcon={<PersonIcon />}
            onClick={toggleMobileDrawer}
          >
            Register
          </Button>
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} Dubai Luxury Cars
        </Typography>
      </Box>
    </Drawer>
  );

  return (
    <>
      <CssBaseline />
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: isHomePage ? 'transparent' : 'background.paper',
            boxShadow: isHomePage ? 'none' : 1,
            color: isHomePage ? 'white' : 'text.primary',
            transition: 'background-color 0.3s ease'
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {/* Logo - Desktop */}
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: isHomePage ? 'white' : theme.palette.primary.main,
                  textDecoration: 'none',
                }}
              >
                DUBAI LUXURY CARS
              </Typography>

              {/* Mobile menu icon */}
              <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={toggleMobileDrawer}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              {/* Logo - Mobile */}
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: isHomePage ? 'white' : theme.palette.primary.main,
                  textDecoration: 'none',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                DUBAI LUXURY CARS
              </Typography>

              {/* Desktop Navigation Links */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.title}
                    component={Link}
                    to={link.path}
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      mx: 1,
                      color: isHomePage ? 'white' : 'text.primary',
                      display: 'block',
                      fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                      position: 'relative',
                      '&::after': location.pathname === link.path ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 10,
                        left: '50%',
                        width: '30%',
                        height: 2,
                        backgroundColor: theme.palette.primary.main,
                        transform: 'translateX(-50%)'
                      } : {}
                    }}
                  >
                    {link.title}
                  </Button>
                ))}
              </Box>

              {/* User Menu */}
              <Box sx={{ flexGrow: 0 }}>
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : currentUser ? (
                  <>
                    <Tooltip title="Open user menu">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar 
                          alt={currentUser.name} 
                          src={currentUser.avatar}
                          sx={{ 
                            bgcolor: theme.palette.primary.main,
                            border: `2px solid ${isHomePage ? 'white' : theme.palette.primary.main}`
                          }}
                        >
                          {currentUser.name?.charAt(0).toUpperCase()}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {userMenuItems.map((item) => (
                        <MenuItem key={item.title} onClick={() => handleUserMenuItemClick(item.path)}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
                            <Typography textAlign="center">{item.title}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LogoutIcon sx={{ mr: 1 }} />
                          <Typography textAlign="center">Logout</Typography>
                        </Box>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/login"
                      sx={{
                        color: isHomePage ? 'white' : theme.palette.primary.main,
                        borderColor: isHomePage ? 'white' : theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: isHomePage ? alpha(theme.palette.primary.main, 0.1) : undefined
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      to="/register"
                      sx={{ 
                        display: { xs: 'none', sm: 'block' },
                        backgroundColor: isHomePage ? 'white' : theme.palette.primary.main,
                        color: isHomePage ? theme.palette.primary.main : 'white',
                        '&:hover': {
                          backgroundColor: isHomePage ? alpha('white', 0.9) : theme.palette.primary.dark
                        }
                      }}
                    >
                      Register
                    </Button>
                  </Box>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile Drawer */}
      {renderMobileDrawer()}
      
      {/* Main Content */}
      <Box component="main">
        <Toolbar /> {/* Empty toolbar for spacing under fixed AppBar */}
        <Outlet />
      </Box>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.secondary.main,
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
                DUBAI LUXURY CARS
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Experience the ultimate luxury car rental service in Dubai. Choose from our exclusive collection of premium vehicles.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <YouTubeIcon />
                </IconButton>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <List dense disablePadding>
                {navLinks.map((link) => (
                  <ListItem key={link.title} disablePadding>
                    <ListItemButton 
                      component={Link} 
                      to={link.path}
                      sx={{ 
                        py: 0.5, 
                        color: 'white',
                        '&:hover': { color: theme.palette.primary.light }
                      }}
                    >
                      <ListItemText primary={link.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Our Services
              </Typography>
              <List dense disablePadding>
                {[
                  'Luxury Car Rentals',
                  'Chauffeur Services',
                  'Airport Transfers',
                  'Wedding Car Hire',
                  'Corporate Services'
                ].map((service) => (
                  <ListItem key={service} disablePadding>
                    <ListItemButton 
                      component={Link} 
                      to="/services"
                      sx={{ 
                        py: 0.5, 
                        color: 'white',
                        '&:hover': { color: theme.palette.primary.light }
                      }}
                    >
                      <ListItemText primary={service} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <List dense disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    Sheikh Zayed Road, Dubai, UAE
                  </Typography>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    +971 4 123 4567
                  </Typography>
                </ListItem>
                <ListItem disablePadding>
                  <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    info@dubailuxurycars.com
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4, borderColor: alpha('white', 0.2) }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mb: { xs: 2, sm: 0 } }}>
              &copy; {new Date().getFullYear()} Dubai Luxury Cars. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link to="/privacy-policy" style={{ color: 'white', textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ '&:hover': { color: theme.palette.primary.light } }}>
                  Privacy Policy
                </Typography>
              </Link>
              <Link to="/terms-of-service" style={{ color: 'white', textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ '&:hover': { color: theme.palette.primary.light } }}>
                  Terms of Service
                </Typography>
              </Link>
              <Link to="/faq" style={{ color: 'white', textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ '&:hover': { color: theme.palette.primary.light } }}>
                  FAQ
                </Typography>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Scroll to top button */}
      <ScrollTop />
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MainLayout;
