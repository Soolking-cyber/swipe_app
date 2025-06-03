import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  CircularProgress,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Fab,
  Zoom,
  Slide,
  alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Refresh as RefreshIcon,
  Favorite as FavoriteIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  BookmarkAdd as BookmarkAddIcon,
  ThumbUp as ThumbUpIcon
} from '@mui/icons-material';

// Import custom components
import CarFilters, { CarFilters as CarFiltersType } from '../../components/CarSwipe/CarFilters';
import CarSwipeCard from '../../components/CarSwipe/CarSwipeCard';

// Define car interface
interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number; // Daily rental price
  images: string[];
  description: string;
  features: string[];
  category: string;
  topSpeed: number;
  acceleration: string; // 0-100 km/h
  fuelType: string;
  transmission: string;
  available: boolean;
  rating: number;
}

// Mock data for cars
const MOCK_CARS: Car[] = [
  {
    id: '1',
    brand: 'Lamborghini',
    model: 'Aventador SVJ',
    year: 2023,
    price: 8500,
    images: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1518987048-93e29699e79a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'Experience the ultimate supercar with the Lamborghini Aventador SVJ. With its aggressive design and powerful V12 engine, this car delivers an unforgettable driving experience.',
    features: ['Leather Interior', 'Sport Package', 'Premium Sound System', 'Carbon Fiber Interior'],
    category: 'Super Car',
    topSpeed: 350,
    acceleration: '2.8s',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    available: true,
    rating: 4.9
  },
  {
    id: '2',
    brand: 'Rolls-Royce',
    model: 'Phantom',
    year: 2023,
    price: 9500,
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1563720223758-a72bc3b4f78e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1562858437-e4073739e1a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'The epitome of luxury, the Rolls-Royce Phantom offers unparalleled comfort and refinement. Experience the pinnacle of automotive luxury with this iconic vehicle.',
    features: ['Leather Interior', 'Panoramic Roof', 'Premium Sound System', 'Massage Seats', 'Starlight Headliner'],
    category: 'Luxury Sedan',
    topSpeed: 250,
    acceleration: '5.3s',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    available: true,
    rating: 4.8
  },
  {
    id: '3',
    brand: 'Ferrari',
    model: 'SF90 Stradale',
    year: 2023,
    price: 7800,
    images: [
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'The Ferrari SF90 Stradale is a hybrid supercar that combines Ferrari\'s racing heritage with cutting-edge technology. Experience the thrill of Italian engineering at its finest.',
    features: ['Leather Interior', 'Sport Package', 'Premium Sound System', 'Carbon Fiber Interior'],
    category: 'Super Car',
    topSpeed: 340,
    acceleration: '2.5s',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    available: true,
    rating: 4.9
  },
  {
    id: '4',
    brand: 'Bentley',
    model: 'Continental GT',
    year: 2023,
    price: 6500,
    images: [
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'The Bentley Continental GT combines luxury and performance in a stunning grand tourer. With its handcrafted interior and powerful engine, it offers the perfect blend of comfort and excitement.',
    features: ['Leather Interior', 'Panoramic Roof', 'Premium Sound System', 'Heated Seats', 'Cooled Seats'],
    category: 'Grand Tourer',
    topSpeed: 330,
    acceleration: '3.6s',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    available: true,
    rating: 4.7
  },
  {
    id: '5',
    brand: 'Aston Martin',
    model: 'DBS Superleggera',
    year: 2023,
    price: 7200,
    images: [
      'https://images.unsplash.com/photo-1600712242805-5f78671b24da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1600712242805-5f78671b24da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1600712242805-5f78671b24da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'The Aston Martin DBS Superleggera is a masterpiece of design and engineering. With its powerful V12 engine and exquisite craftsmanship, it offers a driving experience like no other.',
    features: ['Leather Interior', 'Sport Package', 'Premium Sound System', 'Carbon Fiber Interior'],
    category: 'Grand Tourer',
    topSpeed: 340,
    acceleration: '3.4s',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    available: true,
    rating: 4.8
  },
  {
    id: '6',
    brand: 'McLaren',
    model: '720S',
    year: 2023,
    price: 7000,
    images: [
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'The McLaren 720S is a technological marvel that delivers breathtaking performance and handling. With its innovative design and lightweight construction, it offers an unmatched driving experience.',
    features: ['Leather Interior', 'Sport Package', 'Premium Sound System', 'Carbon Fiber Interior'],
    category: 'Super Car',
    topSpeed: 341,
    acceleration: '2.9s',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    available: true,
    rating: 4.8
  },
  {
    id: '7',
    brand: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2023,
    price: 3500,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e8f2e928464?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'The Mercedes-Benz S-Class is the flagship luxury sedan that sets the standard for comfort and technology. Experience the pinnacle of German engineering and craftsmanship.',
    features: ['Leather Interior', 'Panoramic Roof', 'Premium Sound System', 'Massage Seats', 'Head-up Display', '360° Camera'],
    category: 'Luxury Sedan',
    topSpeed: 250,
    acceleration: '4.9s',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    available: true,
    rating: 4.7
  },
  {
    id: '8',
    brand: 'Porsche',
    model: '911 Turbo S',
    year: 2023,
    price: 5500,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1611821064736-0471fe04bd1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1611821064736-0471fe04bd1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'The Porsche 911 Turbo S is an icon of performance and precision. With its timeless design and cutting-edge technology, it delivers an exhilarating driving experience.',
    features: ['Leather Interior', 'Sport Package', 'Premium Sound System', 'Carbon Fiber Interior'],
    category: 'Sports Car',
    topSpeed: 330,
    acceleration: '2.7s',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    available: true,
    rating: 4.9
  },
  {
    id: '9',
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'The Tesla Model S Plaid is the fastest production electric car in the world. With its cutting-edge technology and instant acceleration, it offers a glimpse into the future of automotive performance.',
    features: ['Premium Interior', 'Panoramic Roof', 'Premium Sound System', 'Self-Driving Capability', 'Head-up Display'],
    category: 'Electric',
    topSpeed: 322,
    acceleration: '1.99s',
    fuelType: 'Electric',
    transmission: 'Automatic',
    available: true,
    rating: 4.8
  },
  {
    id: '10',
    brand: 'BMW',
    model: 'M8 Competition',
    year: 2023,
    price: 4200,
    images: [
      'https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    description: 'The BMW M8 Competition is the ultimate expression of BMW\'s performance and luxury. With its powerful engine and sophisticated technology, it offers an exhilarating driving experience.',
    features: ['Leather Interior', 'Panoramic Roof', 'Premium Sound System', 'Heated Seats', 'Cooled Seats', 'Head-up Display'],
    category: 'Grand Tourer',
    topSpeed: 305,
    acceleration: '3.2s',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    available: true,
    rating: 4.7
  }
];

// Car detail dialog component
const CarDetailDialog: React.FC<{
  open: boolean;
  car: Car | null;
  onClose: () => void;
  onBook: (carId: string) => void;
}> = ({ open, car, onClose, onBook }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!car) return null;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? car.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 2 },
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ position: 'relative', height: { xs: '40vh', sm: '50vh' } }}>
        <Box
          component="img"
          src={car.images[currentImageIndex]}
          alt={`${car.brand} ${car.model}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {car.images.length > 1 && (
          <>
            <IconButton
              sx={{
                position: 'absolute',
                top: '50%',
                left: theme.spacing(2),
                transform: 'translateY(-50%)',
                backgroundColor: alpha(theme.palette.common.white, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.9),
                }
              }}
              onClick={handlePrevImage}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <IconButton
              sx={{
                position: 'absolute',
                top: '50%',
                right: theme.spacing(2),
                transform: 'translateY(-50%)',
                backgroundColor: alpha(theme.palette.common.white, 0.8),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.9),
                }
              }}
              onClick={handleNextImage}
            >
              <ArrowForwardIcon />
            </IconButton>
            
            <Box
              sx={{
                position: 'absolute',
                bottom: theme.spacing(2),
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1
              }}
            >
              {car.images.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex 
                      ? theme.palette.primary.main 
                      : alpha(theme.palette.common.white, 0.7)
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h4" component="div" fontWeight="bold">
              {car.brand} {car.model}
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {car.price.toLocaleString()} AED/day
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            <Chip label={car.year} size="small" />
            <Chip label={car.category} size="small" />
            <Chip label={car.transmission} size="small" />
            <Chip label={car.fuelType} size="small" />
          </Box>
          
          <Typography variant="body1" paragraph>
            {car.description}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Performance
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Top Speed
                </Typography>
                <Typography variant="h6">
                  {car.topSpeed} km/h
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  0-100 km/h
                </Typography>
                <Typography variant="h6">
                  {car.acceleration}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Fuel Type
                </Typography>
                <Typography variant="h6">
                  {car.fuelType}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Transmission
                </Typography>
                <Typography variant="h6">
                  {car.transmission}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={1}>
            {car.features.map((feature, index) => (
              <Grid item key={index}>
                <Chip label={feature} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button 
          onClick={() => onBook(car.id)} 
          variant="contained" 
          color="primary"
          startIcon={<BookmarkAddIcon />}
        >
          Book Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CarSwipePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // States
  const [filters, setFilters] = useState<CarFiltersType>({
    priceRange: { min: 500, max: 10000 },
    brands: [],
    categories: [],
    years: [],
    transmissions: [],
    features: [],
    sortBy: 'popularity',
    search: ''
  });
  
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedCars, setLikedCars] = useState<string[]>([]);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Refs
  const carStackRef = useRef<HTMLDivElement>(null);
  
  // Fetch cars data (mock for now)
  useEffect(() => {
    // Simulate API call
    const fetchCars = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setCars(MOCK_CARS);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setNotification({
          open: true,
          message: 'Failed to load cars. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);
  
  // Apply filters to cars
  useEffect(() => {
    if (cars.length === 0) return;
    
    let result = [...cars];
    
    // Filter by price range
    result = result.filter(car => 
      car.price >= filters.priceRange.min && 
      car.price <= filters.priceRange.max
    );
    
    // Filter by brands
    if (filters.brands.length > 0) {
      result = result.filter(car => filters.brands.includes(car.brand));
    }
    
    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter(car => filters.categories.includes(car.category));
    }
    
    // Filter by years
    if (filters.years.length > 0) {
      result = result.filter(car => filters.years.includes(car.year));
    }
    
    // Filter by transmissions
    if (filters.transmissions.length > 0) {
      result = result.filter(car => filters.transmissions.includes(car.transmission));
    }
    
    // Filter by features (car must have ALL selected features)
    if (filters.features.length > 0) {
      result = result.filter(car => 
        filters.features.every(feature => car.features.includes(feature))
      );
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(car => 
        car.brand.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        car.category.toLowerCase().includes(searchTerm) ||
        car.features.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    }
    
    // Sort results
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      // Default is popularity, which we'll assume is the original order
      default:
        break;
    }
    
    setFilteredCars(result);
    setCurrentIndex(0);
  }, [cars, filters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: CarFiltersType) => {
    setFilters(newFilters);
  };
  
  // Handle car swipe
  const handleSwipe = (direction: 'left' | 'right', carId: string) => {
    if (direction === 'right') {
      // User liked the car
      setLikedCars(prev => [...prev, carId]);
      setNotification({
        open: true,
        message: 'Car added to your favorites!',
        severity: 'success'
      });
    }
    
    // Move to the next car
    setCurrentIndex(prevIndex => prevIndex + 1);
  };
  
  // Handle car info click
  const handleCarInfoClick = (carId: string) => {
    const car = filteredCars.find(c => c.id === carId);
    if (car) {
      setSelectedCar(car);
      setDetailDialogOpen(true);
    }
  };
  
  // Handle booking
  const handleBookCar = (carId: string) => {
    // In a real app, this would navigate to a booking page or open a booking modal
    setDetailDialogOpen(false);
    navigate(`/cars/${carId}`);
  };
  
  // Reset the stack to show all cars again
  const handleResetStack = () => {
    setCurrentIndex(0);
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  // Calculate if we have no more cars to show
  const isStackEmpty = filteredCars.length === 0 || currentIndex >= filteredCars.length;
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Find Your Dream Car
      </Typography>
      
      <Grid container spacing={3}>
        {/* Filters column */}
        <Grid item xs={12} md={4} lg={3}>
          <CarFilters 
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
          
          {!isMobile && likedCars.length > 0 && (
            <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Your Favorites
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                You've liked {likedCars.length} {likedCars.length === 1 ? 'car' : 'cars'}.
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<FavoriteIcon />}
                onClick={() => navigate('/dashboard/favorites')}
              >
                View Favorites
              </Button>
            </Paper>
          )}
        </Grid>
        
        {/* Car swipe column */}
        <Grid item xs={12} md={8} lg={9}>
          <Box
            sx={{
              height: { xs: '60vh', sm: '70vh' },
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {loading ? (
              <CircularProgress size={60} />
            ) : isStackEmpty ? (
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 4,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  borderRadius: 2
                }}
              >
                <Typography variant="h5" gutterBottom>
                  No more cars to show
                </Typography>
                <Typography variant="body1" paragraph>
                  You've seen all cars matching your filters.
                </Typography>
                {filteredCars.length > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={handleResetStack}
                    sx={{ mt: 2 }}
                  >
                    Start Over
                  </Button>
                )}
              </Box>
            ) : (
              <Box
                ref={carStackRef}
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  maxWidth: 600,
                  margin: '0 auto'
                }}
              >
                {/* Show the next few cards in the stack */}
                {filteredCars.slice(currentIndex, currentIndex + 3).map((car, index) => (
                  <Box
                    key={car.id}
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      // Stack the cards with a slight offset
                      transform: `translateY(${index * -10}px) scale(${1 - index * 0.05})`,
                      zIndex: 10 - index,
                      opacity: index === 0 ? 1 : 0.8 - index * 0.2
                    }}
                  >
                    <CarSwipeCard
                      car={car}
                      onSwipe={handleSwipe}
                      onInfoClick={handleCarInfoClick}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          
          {/* Desktop action buttons */}
          {!isMobile && !loading && !isStackEmpty && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 3,
                gap: 2
              }}
            >
              <Fab
                color="error"
                aria-label="dislike"
                onClick={() => handleSwipe('left', filteredCars[currentIndex].id)}
              >
                <CloseIcon />
              </Fab>
              
              <Fab
                color="primary"
                aria-label="info"
                onClick={() => handleCarInfoClick(filteredCars[currentIndex].id)}
              >
                <InfoIcon />
              </Fab>
              
              <Fab
                color="success"
                aria-label="like"
                onClick={() => handleSwipe('right', filteredCars[currentIndex].id)}
              >
                <ThumbUpIcon />
              </Fab>
            </Box>
          )}
        </Grid>
      </Grid>
      
      {/* Car detail dialog */}
      <CarDetailDialog
        open={detailDialogOpen}
        car={selectedCar}
        onClose={() => setDetailDialogOpen(false)}
        onBook={handleBookCar}
      />
      
      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      {/* Mobile action button */}
      {isMobile && likedCars.length > 0 && (
        <Zoom in={true}>
          <Fab
            color="primary"
            aria-label="favorites"
            sx={{
              position: 'fixed',
              bottom: theme.spacing(2),
              left: theme.spacing(2),
              zIndex: 1000
            }}
            onClick={() => navigate('/dashboard/favorites')}
          >
            <FavoriteIcon />
          </Fab>
        </Zoom>
      )}
    </Container>
  );
};

export default CarSwipePage;
