import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Paper,
  useTheme,
  alpha,
  IconButton,
  Rating,
  Chip,
  Avatar,
  useMediaQuery,
  Skeleton,
  Fade,
  Slide
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Speed as SpeedIcon,
  LocalGasStation as FuelIcon,
  Security as SecurityIcon,
  EmojiEvents as AwardIcon,
  Support as SupportIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Star as StarIcon,
  Check as CheckIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Car interface
interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  category: string;
  topSpeed: number;
  acceleration: string;
  fuelType: string;
  transmission: string;
  rating: number;
}

// Testimonial interface
interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  role: string;
  comment: string;
  rating: number;
}

// Mock testimonials
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ahmed Al Mansouri',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Business Executive',
    comment: 'The service was impeccable. The Bentley Continental GT was delivered on time and in pristine condition. Will definitely use again for my next business trip to Dubai.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sophia Williams',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Luxury Travel Blogger',
    comment: 'As someone who reviews luxury experiences for a living, I was thoroughly impressed with the range of vehicles and the seamless booking process. The Ferrari was a dream to drive along Sheikh Zayed Road!',
    rating: 5
  },
  {
    id: 3,
    name: 'Mohammed Al Farsi',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    role: 'Entrepreneur',
    comment: 'The Lamborghini Aventador turned heads everywhere I went. The staff was professional and the car was in perfect condition. Highly recommend for a luxury experience in Dubai.',
    rating: 4
  }
];

// Benefits data
const benefits = [
  {
    icon: <CarIcon fontSize="large" />,
    title: 'Premium Fleet',
    description: 'Choose from our extensive collection of the world\'s most prestigious luxury and sports cars.'
  },
  {
    icon: <SecurityIcon fontSize="large" />,
    title: 'Fully Insured',
    description: 'Drive with peace of mind knowing you\'re covered by our comprehensive insurance policy.'
  },
  {
    icon: <SupportIcon fontSize="large" />,
    title: '24/7 Support',
    description: 'Our dedicated concierge team is available around the clock to assist with any requests.'
  },
  {
    icon: <AwardIcon fontSize="large" />,
    title: 'VIP Experience',
    description: 'Enjoy personalized service, door-to-door delivery, and exclusive membership benefits.'
  }
];

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [popularCars, setPopularCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch popular cars
  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await axios.get(`${API_URL}/cars/featured/popular?limit=4`);
        // setPopularCars(response.data.data);
        
        // Mock data for now
        setTimeout(() => {
          setPopularCars([
            {
              id: '1',
              brand: 'Lamborghini',
              model: 'Aventador SVJ',
              year: 2023,
              price: 8500,
              images: ['https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
              category: 'Super Car',
              topSpeed: 350,
              acceleration: '2.8s',
              fuelType: 'Petrol',
              transmission: 'Automatic',
              rating: 4.9
            },
            {
              id: '2',
              brand: 'Rolls-Royce',
              model: 'Phantom',
              year: 2023,
              price: 9500,
              images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
              category: 'Luxury Sedan',
              topSpeed: 250,
              acceleration: '5.3s',
              fuelType: 'Petrol',
              transmission: 'Automatic',
              rating: 4.8
            },
            {
              id: '3',
              brand: 'Ferrari',
              model: 'SF90 Stradale',
              year: 2023,
              price: 7800,
              images: ['https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
              category: 'Super Car',
              topSpeed: 340,
              acceleration: '2.5s',
              fuelType: 'Hybrid',
              transmission: 'Automatic',
              rating: 4.9
            },
            {
              id: '4',
              brand: 'Bentley',
              model: 'Continental GT',
              year: 2023,
              price: 6500,
              images: ['https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
              category: 'Grand Tourer',
              topSpeed: 330,
              acceleration: '3.6s',
              fuelType: 'Petrol',
              transmission: 'Automatic',
              rating: 4.7
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching popular cars:', err);
        setError('Failed to load popular cars. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPopularCars();
  }, []);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString()}`;
  };
  
  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: '100vh', md: '90vh' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          color: 'white',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
            zIndex: -1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)`,
            zIndex: -1
          }
        }}
      >
        <Container maxWidth="lg">
          <Fade in={true} timeout={1000}>
            <Box sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                Experience Luxury on Dubai's Roads
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  fontWeight: 300,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                Rent the world's most prestigious vehicles and make your stay in Dubai truly unforgettable.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/cars"
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Browse Our Fleet
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: alpha('#ffffff', 0.1)
                    }
                  }}
                  component={RouterLink}
                  to="/about"
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
        
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            animation: 'bounce 2s infinite'
          }}
        >
          <IconButton
            sx={{
              color: 'white',
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.5),
              },
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': {
                  transform: 'translateY(0)'
                },
                '40%': {
                  transform: 'translateY(-20px)'
                },
                '60%': {
                  transform: 'translateY(-10px)'
                }
              },
              animation: 'bounce 2s infinite'
            }}
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }}
          >
            <ArrowDownwardIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Benefits Section */}
      <Box sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: theme.palette.text.primary
              }}
            >
              Why Choose Us
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 300,
                color: theme.palette.text.secondary,
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Dubai Luxury Cars offers an unparalleled experience with our premium fleet and exceptional service.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in={true} timeout={500 + index * 300}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 2,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    
                    <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                      {benefit.title}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Popular Cars Section */}
      <Box sx={{ py: 10, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: theme.palette.text.primary
                }}
              >
                Featured Vehicles
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 300,
                  color: theme.palette.text.secondary
                }}
              >
                Our most popular luxury cars for an unforgettable experience
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              color="primary"
              component={RouterLink}
              to="/cars"
              endIcon={<KeyboardArrowRightIcon />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              View All Cars
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            {loading ? (
              // Loading skeletons
              Array.from(new Array(4)).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={32} width="80%" />
                      <Skeleton variant="text" height={24} width="40%" />
                      <Skeleton variant="text" height={24} width="60%" />
                      <Skeleton variant="text" height={24} width="50%" />
                    </CardContent>
                    <CardActions>
                      <Skeleton variant="rectangular" height={36} width={120} />
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : error ? (
              <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
                <Typography color="error">{error}</Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </Box>
            ) : (
              popularCars.map((car, index) => (
                <Grid item xs={12} sm={6} md={3} key={car.id}>
                  <Fade in={true} timeout={500 + index * 300}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[10]
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={car.images[0]}
                          alt={`${car.brand} ${car.model}`}
                          sx={{ objectFit: 'cover' }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            backgroundColor: alpha(theme.palette.primary.main, 0.9),
                            color: 'white',
                            py: 0.5,
                            px: 1.5,
                            borderRadius: 1,
                            fontWeight: 'bold'
                          }}
                        >
                          {formatCurrency(car.price)}/day
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                          {car.brand} {car.model}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating 
                            value={car.rating} 
                            precision={0.1} 
                            readOnly 
                            size="small"
                            sx={{ color: theme.palette.primary.main }}
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {car.rating.toFixed(1)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip 
                            label={car.category} 
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }}
                          />
                          <Chip 
                            label={car.year} 
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                              fontWeight: 500
                            }}
                          />
                        </Box>
                        
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SpeedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary, mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {car.topSpeed} km/h
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FuelIcon sx={{ fontSize: 18, color: theme.palette.text.secondary, mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {car.fuelType}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                      
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button 
                          size="small" 
                          variant="contained"
                          fullWidth
                          onClick={() => navigate(`/cars/${car.id}`)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))
            )}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6, display: { xs: 'block', sm: 'none' } }}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/cars"
              endIcon={<KeyboardArrowRightIcon />}
              size="large"
            >
              View All Cars
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* How It Works Section */}
      <Box sx={{ py: 10, backgroundColor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: theme.palette.text.primary
              }}
            >
              How It Works
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 300,
                color: theme.palette.text.secondary,
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Renting your dream car is simple with our easy 3-step process
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {[
              {
                step: 1,
                title: 'Browse & Select',
                description: 'Explore our extensive collection of luxury vehicles and choose the perfect car for your needs.',
                icon: '🔍'
              },
              {
                step: 2,
                title: 'Book & Pay',
                description: 'Reserve your car with our secure booking system and flexible payment options.',
                icon: '📅'
              },
              {
                step: 3,
                title: 'Enjoy the Drive',
                description: 'Pick up your car or have it delivered to your location, then hit the road in style.',
                icon: '🚗'
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in={true} timeout={500 + index * 300}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        mb: 3,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: index === 2 ? 'auto' : '100%',
                          right: index === 2 ? '100%' : 'auto',
                          width: index === 1 ? '50%' : '100%',
                          height: 2,
                          backgroundColor: alpha(theme.palette.primary.main, 0.3),
                          display: { xs: 'none', md: index === 1 ? 'block' : (index === 0 || index === 2 ? 'block' : 'none') }
                        }
                      }}
                    >
                      {step.icon}
                    </Box>
                    
                    <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                      {step.title}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/cars"
              sx={{ 
                py: 1.5, 
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              Start Browsing Now
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Box 
        sx={{ 
          py: 10, 
          backgroundColor: theme.palette.secondary.main,
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: 'white'
              }}
            >
              What Our Clients Say
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 300,
                color: alpha('white', 0.8),
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Hear from our satisfied customers about their luxury car rental experience
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <Fade in={true} timeout={500 + index * 300}>
                  <Paper
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      backgroundColor: alpha('white', 0.05),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha('white', 0.1)}`,
                      color: 'white'
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <Rating 
                        value={testimonial.rating} 
                        readOnly 
                        sx={{ color: theme.palette.primary.main }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3, 
                        flexGrow: 1,
                        fontStyle: 'italic',
                        color: alpha('white', 0.9)
                      }}
                    >
                      "{testimonial.comment}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color={alpha('white', 0.7)}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 10, 
          backgroundColor: theme.palette.background.default,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                color: theme.palette.text.primary
              }}
            >
              Ready to Experience Luxury?
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 300,
                color: theme.palette.text.secondary,
                mb: 4
              }}
            >
              Join our exclusive clientele and drive the car of your dreams in Dubai
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/cars"
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                Browse Our Fleet
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                size="large"
                component={RouterLink}
                to="/contact"
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Box>
        </Container>
        
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            right: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            zIndex: 0
          }}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
