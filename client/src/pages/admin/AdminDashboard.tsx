import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  useTheme,
  alpha,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  BookOnline as BookingIcon,
  Person as UserIcon,
  AttachMoney as RevenueIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

// Mock data for the dashboard
const SUMMARY_DATA = {
  totalCars: 48,
  availableCars: 32,
  totalBookings: 156,
  activeBookings: 24,
  totalRevenue: 1250000,
  monthlyRevenue: 320000,
  totalUsers: 345,
  activeUsers: 120,
  averageRating: 4.8
};

const RECENT_BOOKINGS = [
  {
    id: 'B1001',
    customerName: 'Ahmed Al Mansouri',
    customerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    carName: 'Lamborghini Aventador',
    startDate: '2023-06-01',
    endDate: '2023-06-05',
    totalAmount: 34000,
    status: 'active'
  },
  {
    id: 'B1002',
    customerName: 'Sophia Williams',
    customerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    carName: 'Rolls-Royce Phantom',
    startDate: '2023-06-02',
    endDate: '2023-06-08',
    totalAmount: 57000,
    status: 'active'
  },
  {
    id: 'B1003',
    customerName: 'Mohammed Al Farsi',
    customerAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    carName: 'Ferrari SF90 Stradale',
    startDate: '2023-06-03',
    endDate: '2023-06-06',
    totalAmount: 23400,
    status: 'pending'
  },
  {
    id: 'B1004',
    customerName: 'Emma Johnson',
    customerAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    carName: 'Bentley Continental GT',
    startDate: '2023-06-01',
    endDate: '2023-06-03',
    totalAmount: 13000,
    status: 'completed'
  },
  {
    id: 'B1005',
    customerName: 'Khalid Al Mazrouei',
    customerAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    carName: 'Aston Martin DBS',
    startDate: '2023-06-05',
    endDate: '2023-06-10',
    totalAmount: 36000,
    status: 'cancelled'
  }
];

const POPULAR_CARS = [
  {
    id: 'C1001',
    name: 'Lamborghini Aventador',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bookings: 24,
    revenue: 204000,
    availability: 'available'
  },
  {
    id: 'C1002',
    name: 'Rolls-Royce Phantom',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bookings: 18,
    revenue: 171000,
    availability: 'booked'
  },
  {
    id: 'C1003',
    name: 'Ferrari SF90 Stradale',
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bookings: 16,
    revenue: 124800,
    availability: 'available'
  },
  {
    id: 'C1004',
    name: 'Bentley Continental GT',
    image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bookings: 14,
    revenue: 91000,
    availability: 'maintenance'
  }
];

const MONTHLY_REVENUE_DATA = [
  { name: 'Jan', revenue: 180000 },
  { name: 'Feb', revenue: 190000 },
  { name: 'Mar', revenue: 210000 },
  { name: 'Apr', revenue: 240000 },
  { name: 'May', revenue: 280000 },
  { name: 'Jun', revenue: 320000 },
  { name: 'Jul', revenue: 0 },
  { name: 'Aug', revenue: 0 },
  { name: 'Sep', revenue: 0 },
  { name: 'Oct', revenue: 0 },
  { name: 'Nov', revenue: 0 },
  { name: 'Dec', revenue: 0 }
];

const CAR_CATEGORY_DATA = [
  { name: 'Super Car', value: 12 },
  { name: 'Luxury Sedan', value: 8 },
  { name: 'Sports Car', value: 10 },
  { name: 'Luxury SUV', value: 6 },
  { name: 'Grand Tourer', value: 7 },
  { name: 'Convertible', value: 5 }
];

const BOOKING_STATUS_DATA = [
  { name: 'Active', value: 24 },
  { name: 'Pending', value: 12 },
  { name: 'Completed', value: 108 },
  { name: 'Cancelled', value: 12 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#B8860B'];

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString()}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'completed':
        return theme.palette.info.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Get availability color
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return theme.palette.success.main;
      case 'booked':
        return theme.palette.info.main;
      case 'maintenance':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Get availability icon
  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available':
        return <CheckIcon fontSize="small" />;
      case 'booked':
        return <BookingIcon fontSize="small" />;
      case 'maintenance':
        return <WarningIcon fontSize="small" />;
      default:
        return <CloseIcon fontSize="small" />;
    }
  };
  
  // Calculate revenue trend
  const revenueTrend = MONTHLY_REVENUE_DATA[5].revenue > MONTHLY_REVENUE_DATA[4].revenue;
  const revenueTrendPercentage = Math.round(
    ((MONTHLY_REVENUE_DATA[5].revenue - MONTHLY_REVENUE_DATA[4].revenue) / MONTHLY_REVENUE_DATA[4].revenue) * 100
  );
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                <RevenueIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Monthly Revenue
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
              {formatCurrency(SUMMARY_DATA.monthlyRevenue)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {revenueTrend ? (
                <TrendingUpIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
              ) : (
                <TrendingDownIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
              )}
              <Typography
                variant="body2"
                sx={{ color: revenueTrend ? theme.palette.success.main : theme.palette.error.main }}
              >
                {revenueTrend ? '+' : '-'}{Math.abs(revenueTrendPercentage)}% from last month
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                <BookingIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Active Bookings
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
              {SUMMARY_DATA.activeBookings}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {SUMMARY_DATA.totalBookings} total bookings
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                <CarIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Available Cars
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
              {SUMMARY_DATA.availableCars}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {SUMMARY_DATA.totalCars} total in fleet
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 2 }}>
                <StarIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Customer Rating
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
              {SUMMARY_DATA.averageRating}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Based on {SUMMARY_DATA.totalBookings} reviews
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Monthly Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2">
                Monthly Revenue
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/admin/analytics')}
              >
                View Details
              </Button>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MONTHLY_REVENUE_DATA}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `${value / 1000}k`}
                    domain={[0, 'dataMax + 50000']}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [`${formatCurrency(value as number)}`, 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Pie Charts */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Car Categories
                </Typography>
                <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CAR_CATEGORY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {CAR_CATEGORY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value, name) => [`${value} cars`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Booking Status
                </Typography>
                <Box sx={{ height: 200, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={BOOKING_STATUS_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {BOOKING_STATUS_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value, name) => [`${value} bookings`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Recent Bookings
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/admin/bookings')}
              >
                View All
              </Button>
            </Box>
            <List sx={{ width: '100%' }}>
              {RECENT_BOOKINGS.map((booking, index) => (
                <React.Fragment key={booking.id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton edge="end" onClick={() => navigate(`/admin/bookings/${booking.id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                    }
                    sx={{ px: 1 }}
                  >
                    <ListItemAvatar>
                      <Avatar src={booking.customerAvatar} alt={booking.customerName} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle2" component="span">
                            {booking.customerName}
                          </Typography>
                          <Chip
                            size="small"
                            label={booking.status}
                            sx={{ 
                              ml: 1,
                              bgcolor: alpha(getStatusColor(booking.status), 0.1),
                              color: getStatusColor(booking.status),
                              fontWeight: 'medium',
                              textTransform: 'capitalize'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" color="text.primary">
                            {booking.carName}
                          </Typography>
                          <Typography variant="body2" component="span" color="text.secondary" sx={{ display: 'block' }}>
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </Typography>
                          <Typography variant="body2" component="span" fontWeight="bold" color="primary">
                            {formatCurrency(booking.totalAmount)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < RECENT_BOOKINGS.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Popular Cars */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Top Performing Cars
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/admin/cars')}
              >
                View All
              </Button>
            </Box>
            <Grid container spacing={2}>
              {POPULAR_CARS.map((car) => (
                <Grid item xs={12} sm={6} key={car.id}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        position: 'relative',
                        height: 140,
                        backgroundImage: `url(${car.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <Tooltip title={car.availability} placement="top">
                        <Chip
                          size="small"
                          icon={getAvailabilityIcon(car.availability)}
                          label={car.availability}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: alpha(getAvailabilityColor(car.availability), 0.9),
                            color: 'white',
                            textTransform: 'capitalize'
                          }}
                        />
                      </Tooltip>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      <Typography variant="subtitle1" component="div" gutterBottom noWrap>
                        {car.name}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Bookings
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {car.bookings}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Revenue
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(car.revenue)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Utilization
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(car.bookings / 30) * 100} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              bgcolor: theme.palette.primary.main
                            }
                          }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/admin/cars/${car.id}`)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
