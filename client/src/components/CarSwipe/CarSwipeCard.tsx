import React, { useState, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  styled,
  useTheme,
  useMediaQuery,
  Rating
} from '@mui/material';
import { 
  Favorite as FavoriteIcon,
  Close as CloseIcon,
  Speed as SpeedIcon,
  AttachMoney as PriceIcon,
  LocalGasStation as FuelIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Define the Car interface
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

interface CarSwipeCardProps {
  car: Car;
  onSwipe: (direction: 'left' | 'right', carId: string) => void;
  onInfoClick?: (carId: string) => void;
}

// Styled components
const SwipeCard = styled(animated(Card))(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  touchAction: 'none',
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
  zIndex: 1,
}));

const ActionIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  padding: theme.spacing(2),
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  opacity: 0,
}));

const LeftIndicator = styled(ActionIndicator)(({ theme }) => ({
  left: theme.spacing(3),
  border: `3px solid ${theme.palette.error.main}`,
  color: theme.palette.error.main,
}));

const RightIndicator = styled(ActionIndicator)(({ theme }) => ({
  right: theme.spacing(3),
  border: `3px solid ${theme.palette.success.main}`,
  color: theme.palette.success.main,
}));

const CarFeatureChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: 'white',
  backdropFilter: 'blur(5px)',
  fontWeight: 500,
}));

const InfoButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  zIndex: 2,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const CarSwipeCard: React.FC<CarSwipeCardProps> = ({ car, onSwipe, onInfoClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Refs for card dimensions
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Animation for the card
  const [{ x, y, rotateZ, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotateZ: 0,
    scale: 1,
    config: { tension: 300, friction: 30 }
  }));
  
  // Animation for the like/dislike indicators
  const [leftIndicatorProps, leftIndicatorApi] = useSpring(() => ({
    opacity: 0,
    scale: 0.8,
    config: { tension: 300, friction: 20 }
  }));
  
  const [rightIndicatorProps, rightIndicatorApi] = useSpring(() => ({
    opacity: 0,
    scale: 0.8,
    config: { tension: 300, friction: 20 }
  }));
  
  // Setup the drag handler
  const bind = useDrag(({ down, movement: [mx], direction: [xDir], velocity: [vx], cancel }) => {
    const trigger = vx > 0.2; // Velocity threshold for swipe
    const dir = xDir < 0 ? -1 : 1; // Direction of swipe
    
    // Calculate the rotation based on drag distance
    const rotate = mx / 20;
    
    // Update indicator opacity based on drag distance
    const dragThreshold = 100; // Distance threshold for full opacity
    const dragRatio = Math.min(Math.abs(mx) / dragThreshold, 1);
    
    if (mx < 0) {
      // Swiping left (dislike)
      leftIndicatorApi.start({
        opacity: dragRatio,
        scale: 0.8 + (dragRatio * 0.2)
      });
      rightIndicatorApi.start({ opacity: 0, scale: 0.8 });
    } else if (mx > 0) {
      // Swiping right (like)
      rightIndicatorApi.start({
        opacity: dragRatio,
        scale: 0.8 + (dragRatio * 0.2)
      });
      leftIndicatorApi.start({ opacity: 0, scale: 0.8 });
    } else {
      // Not swiping
      leftIndicatorApi.start({ opacity: 0, scale: 0.8 });
      rightIndicatorApi.start({ opacity: 0, scale: 0.8 });
    }
    
    // If we're not holding down the mouse/finger anymore...
    if (!down) {
      // Check if we passed the threshold for a swipe
      if (trigger && Math.abs(mx) > 100) {
        // Get the card width to know how far to throw it
        const width = cardRef.current?.offsetWidth || 300;
        
        // Throw the card out of screen
        api.start({
          x: dir * (width * 1.5),
          y: 0,
          rotateZ: rotate * 2,
          scale: 0.8,
          config: { duration: 300 },
          onRest: () => {
            // Call the onSwipe callback when animation finishes
            onSwipe(dir === 1 ? 'right' : 'left', car.id);
          }
        });
        
        // Reset indicators
        leftIndicatorApi.start({ opacity: 0, scale: 0.8 });
        rightIndicatorApi.start({ opacity: 0, scale: 0.8 });
        
        return;
      }
      
      // If we didn't pass the threshold, reset the card position
      api.start({ x: 0, y: 0, rotateZ: 0, scale: 1 });
      leftIndicatorApi.start({ opacity: 0, scale: 0.8 });
      rightIndicatorApi.start({ opacity: 0, scale: 0.8 });
    } else {
      // While dragging, update the card position
      api.start({ x: mx, rotateZ: rotate, scale: 1 - Math.abs(mx) / 1000 });
    }
  }, {
    from: () => [x.get(), 0],
    filterTaps: true,
    bounds: { left: -500, right: 500, top: -100, bottom: 100 },
    rubberband: true
  });
  
  // Function to cycle through car images
  const cycleImages = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
  };
  
  // Format price with commas for thousands
  const formattedPrice = car.price.toLocaleString('en-US');
  
  return (
    <SwipeCard ref={cardRef} {...bind()} style={{ x, y, rotateZ, scale }}>
      <CardMedia
        component="img"
        height={isMobile ? "300" : "450"}
        image={car.images[currentImageIndex]}
        alt={`${car.brand} ${car.model}`}
        onClick={cycleImages}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardOverlay />
      
      {/* Left indicator (dislike) */}
      <LeftIndicator style={leftIndicatorProps}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <CloseIcon sx={{ mr: 1 }} /> PASS
        </Typography>
      </LeftIndicator>
      
      {/* Right indicator (like) */}
      <RightIndicator style={rightIndicatorProps}>
        <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <FavoriteIcon sx={{ mr: 1 }} /> LIKE
        </Typography>
      </RightIndicator>
      
      <CardContent sx={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        zIndex: 2,
        color: 'white',
        pb: 4
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" component="div" fontWeight="bold">
            {car.brand} {car.model}
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <PriceIcon sx={{ mr: 0.5 }} /> {formattedPrice} AED/day
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {car.year}
          </Typography>
          <Rating value={car.rating} readOnly size="small" sx={{ mr: 1 }} />
          <Typography variant="body2">
            ({car.rating.toFixed(1)})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
          <CarFeatureChip 
            icon={<SpeedIcon />} 
            label={`${car.topSpeed} km/h`} 
            size="small" 
          />
          <CarFeatureChip 
            icon={<FuelIcon />} 
            label={car.fuelType} 
            size="small" 
          />
          <CarFeatureChip 
            label={car.transmission} 
            size="small" 
          />
          <CarFeatureChip 
            label={car.category} 
            size="small" 
          />
        </Box>
        
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {car.description}
        </Typography>
      </CardContent>
      
      <InfoButton size="medium" onClick={() => onInfoClick && onInfoClick(car.id)}>
        <InfoIcon />
      </InfoButton>
      
      {/* Action buttons for mobile - alternative to swiping */}
      {isMobile && (
        <Box sx={{ 
          position: 'absolute', 
          bottom: theme.spacing(2), 
          left: '50%', 
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          zIndex: 3
        }}>
          <IconButton 
            sx={{ 
              backgroundColor: theme.palette.error.main,
              color: 'white',
              '&:hover': { backgroundColor: theme.palette.error.dark }
            }}
            onClick={() => onSwipe('left', car.id)}
          >
            <CloseIcon />
          </IconButton>
          
          <IconButton 
            sx={{ 
              backgroundColor: theme.palette.success.main,
              color: 'white',
              '&:hover': { backgroundColor: theme.palette.success.dark }
            }}
            onClick={() => onSwipe('right', car.id)}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      )}
    </SwipeCard>
  );
};

export default CarSwipeCard;
