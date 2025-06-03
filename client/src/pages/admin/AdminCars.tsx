import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemAvatar,
  List,
  ListItem,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Build as BuildIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  DeleteForever as DeleteForeverIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  DirectionsCar as CarIcon,
  LocalGasStation as FuelIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';

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
  maintenance: boolean;
  rating: number;
  bookings: number;
  revenue: number;
  addedDate: string;
  lastUpdated: string;
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
    maintenance: false,
    rating: 4.9,
    bookings: 24,
    revenue: 204000,
    addedDate: '2023-01-15',
    lastUpdated: '2023-05-20'
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
    available: false,
    maintenance: false,
    rating: 4.8,
    bookings: 18,
    revenue: 171000,
    addedDate: '2023-02-10',
    lastUpdated: '2023-05-15'
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
    maintenance: false,
    rating: 4.9,
    bookings: 16,
    revenue: 124800,
    addedDate: '2023-01-20',
    lastUpdated: '2023-04-30'
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
    available: false,
    maintenance: true,
    rating: 4.7,
    bookings: 14,
    revenue: 91000,
    addedDate: '2023-02-05',
    lastUpdated: '2023-05-10'
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
    maintenance: false,
    rating: 4.8,
    bookings: 12,
    revenue: 86400,
    addedDate: '2023-03-15',
    lastUpdated: '2023-05-05'
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
    maintenance: false,
    rating: 4.8,
    bookings: 15,
    revenue: 105000,
    addedDate: '2023-02-25',
    lastUpdated: '2023-04-20'
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
    maintenance: false,
    rating: 4.7,
    bookings: 20,
    revenue: 70000,
    addedDate: '2023-01-10',
    lastUpdated: '2023-05-01'
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
    maintenance: false,
    rating: 4.9,
    bookings: 22,
    revenue: 121000,
    addedDate: '2023-01-05',
    lastUpdated: '2023-04-15'
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
    maintenance: false,
    rating: 4.8,
    bookings: 19,
    revenue: 85500,
    addedDate: '2023-03-01',
    lastUpdated: '2023-05-12'
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
    maintenance: false,
    rating: 4.7,
    bookings: 17,
    revenue: 71400,
    addedDate: '2023-02-20',
    lastUpdated: '2023-04-25'
  }
];

// Available options for dropdowns
const availableBrands = [
  'Rolls-Royce', 'Bentley', 'Lamborghini', 'Ferrari', 'Aston Martin',
  'McLaren', 'Bugatti', 'Porsche', 'Mercedes-Benz', 'BMW', 'Audi',
  'Maserati', 'Jaguar', 'Land Rover', 'Lexus', 'Tesla'
];

const availableCategories = [
  'Luxury Sedan', 'Sports Car', 'Super Car', 'Luxury SUV', 
  'Convertible', 'Coupe', 'Grand Tourer', 'Electric'
];

const availableTransmissions = ['Automatic', 'Manual', 'Semi-Automatic'];

const availableFuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

const availableFeatures = [
  'Leather Interior', 'Panoramic Roof', 'Sport Package', 'Premium Sound System',
  'Adaptive Cruise Control', 'Heated Seats', 'Cooled Seats', 'Massage Seats',
  'Night Vision', 'Head-up Display', '360° Camera', 'Self-Driving Capability',
  'Carbon Fiber Interior', 'Starlight Headliner', 'Rear Entertainment System'
];

// Default empty car for new entries
const defaultCar: Omit<Car, 'id' | 'bookings' | 'revenue' | 'addedDate' | 'lastUpdated'> = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 1000,
  images: [],
  description: '',
  features: [],
  category: '',
  topSpeed: 0,
  acceleration: '',
  fuelType: '',
  transmission: '',
  available: true,
  maintenance: false,
  rating: 0
};

// View modes
type ViewMode = 'grid' | 'table';

const AdminCars: React.FC = () => {
  const theme = useTheme();
  
  // State
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [newCar, setNewCar] = useState({ ...defaultCar });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState({
    brands: [] as string[],
    categories: [] as string[],
    available: null as boolean | null,
    maintenance: null as boolean | null
  });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<{ el: HTMLElement | null, carId: string | null }>({ el: null, carId: null });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [imageUploadDialog, setImageUploadDialog] = useState(false);
  const [tempImages, setTempImages] = useState<string[]>([]);
  
  // Load cars data
  useEffect(() => {
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
  
  // Filter cars based on search term and filters
  const filteredCars = cars.filter(car => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Brand filter
    const matchesBrand = filters.brands.length === 0 || filters.brands.includes(car.brand);
    
    // Category filter
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(car.category);
    
    // Availability filter
    const matchesAvailability = filters.available === null || car.available === filters.available;
    
    // Maintenance filter
    const matchesMaintenance = filters.maintenance === null || car.maintenance === filters.maintenance;
    
    return matchesSearch && matchesBrand && matchesCategory && matchesAvailability && matchesMaintenance;
  });
  
  // Data grid columns
  const columns: GridColDef[] = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar
          variant="rounded"
          src={params.row.images[0]}
          alt={`${params.row.brand} ${params.row.model}`}
          sx={{ width: 60, height: 40, borderRadius: 1 }}
        />
      )
    },
    { field: 'brand', headerName: 'Brand', width: 130 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'year', headerName: 'Year', width: 90, type: 'number' },
    {
      field: 'price',
      headerName: 'Price (AED/day)',
      width: 150,
      type: 'number',
      valueFormatter: (params) => `${params.value.toLocaleString()}`
    },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        let color;
        let label;
        let icon;
        
        if (params.row.maintenance) {
          color = theme.palette.warning.main;
          label = 'Maintenance';
          icon = <BuildIcon fontSize="small" />;
        } else if (params.row.available) {
          color = theme.palette.success.main;
          label = 'Available';
          icon = <CheckIcon fontSize="small" />;
        } else {
          color = theme.palette.info.main;
          label = 'Booked';
          icon = <CloseIcon fontSize="small" />;
        }
        
        return (
          <Chip
            icon={icon}
            label={label}
            size="small"
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              '& .MuiChip-icon': { color }
            }}
          />
        );
      }
    },
    {
      field: 'bookings',
      headerName: 'Bookings',
      width: 100,
      type: 'number'
    },
    {
      field: 'revenue',
      headerName: 'Revenue (AED)',
      width: 150,
      type: 'number',
      valueFormatter: (params) => `${params.value.toLocaleString()}`
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 18, mr: 0.5 }} />
          <Typography variant="body2">{params.value.toFixed(1)}</Typography>
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={(event) => handleOpenActionMenu(event, params.row.id)}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];
  
  // Handle opening action menu
  const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, carId: string) => {
    setActionMenuAnchor({ el: event.currentTarget, carId });
  };
  
  // Handle closing action menu
  const handleCloseActionMenu = () => {
    setActionMenuAnchor({ el: null, carId: null });
  };
  
  // Handle edit car
  const handleEditCar = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    if (car) {
      setEditingCar(car);
      setTempImages([...car.images]);
      setOpenDialog(true);
    }
    handleCloseActionMenu();
  };
  
  // Handle delete car
  const handleDeleteCar = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    if (car) {
      setCarToDelete(car);
      setDeleteConfirmDialog(true);
    }
    handleCloseActionMenu();
  };
  
  // Handle view car details
  const handleViewCar = (carId: string) => {
    // In a real app, this would navigate to a detailed view
    console.log(`View car details for ID: ${carId}`);
    handleCloseActionMenu();
  };
  
  // Confirm car deletion
  const confirmDeleteCar = () => {
    if (carToDelete) {
      // In a real app, this would make an API call
      setCars(cars.filter(car => car.id !== carToDelete.id));
      setNotification({
        open: true,
        message: `${carToDelete.brand} ${carToDelete.model} has been deleted.`,
        severity: 'success'
      });
    }
    setDeleteConfirmDialog(false);
    setCarToDelete(null);
  };
  
  // Handle opening filter menu
  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  // Handle closing filter menu
  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };
  
  // Handle filter change
  const handleFilterChange = (filterType: keyof typeof filters, value: any) => {
    if (filterType === 'brands' || filterType === 'categories') {
      setFilters(prev => {
        const currentValues = prev[filterType] as string[];
        let newValues: string[];
        
        if (currentValues.includes(value)) {
          newValues = currentValues.filter(item => item !== value);
        } else {
          newValues = [...currentValues, value];
        }
        
        return { ...prev, [filterType]: newValues };
      });
    } else {
      setFilters(prev => ({ ...prev, [filterType]: value }));
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      available: null,
      maintenance: null
    });
    setSearchTerm('');
    handleCloseFilterMenu();
  };
  
  // Handle adding a new car
  const handleAddCar = () => {
    setEditingCar(null);
    setNewCar({ ...defaultCar });
    setTempImages([]);
    setOpenDialog(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCar(null);
    setCurrentTab(0);
  };
  
  // Handle save car (create or update)
  const handleSaveCar = () => {
    if (editingCar) {
      // Update existing car
      const updatedCar = {
        ...editingCar,
        ...newCar,
        images: tempImages,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setCars(cars.map(car => car.id === editingCar.id ? updatedCar : car));
      setNotification({
        open: true,
        message: `${updatedCar.brand} ${updatedCar.model} has been updated.`,
        severity: 'success'
      });
    } else {
      // Create new car
      const newCarEntry: Car = {
        id: `${cars.length + 1}`, // In a real app, this would be generated by the backend
        ...newCar,
        images: tempImages,
        bookings: 0,
        revenue: 0,
        addedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setCars([...cars, newCarEntry]);
      setNotification({
        open: true,
        message: `${newCarEntry.brand} ${newCarEntry.model} has been added.`,
        severity: 'success'
      });
    }
    
    handleCloseDialog();
  };
  
  // Handle input change for car form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setNewCar(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle number input change
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCar(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewCar(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle features change
  const handleFeaturesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNewCar(prev => ({ ...prev, features: event.target.value as string[] }));
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  
  // Handle image upload dialog
  const handleOpenImageUpload = () => {
    setImageUploadDialog(true);
  };
  
  // Handle close image upload dialog
  const handleCloseImageUpload = () => {
    setImageUploadDialog(false);
  };
  
  // Handle adding image URL
  const handleAddImageUrl = (url: string) => {
    if (url && !tempImages.includes(url)) {
      setTempImages(prev => [...prev, url]);
    }
    handleCloseImageUpload();
  };
  
  // Handle removing image
  const handleRemoveImage = (index: number) => {
    setTempImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle notification close
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString()}`;
  };
  
  // Initialize car form when editing
  useEffect(() => {
    if (editingCar) {
      setNewCar({
        brand: editingCar.brand,
        model: editingCar.model,
        year: editingCar.year,
        price: editingCar.price,
        images: editingCar.images,
        description: editingCar.description,
        features: editingCar.features,
        category: editingCar.category,
        topSpeed: editingCar.topSpeed,
        acceleration: editingCar.acceleration,
        fuelType: editingCar.fuelType,
        transmission: editingCar.transmission,
        available: editingCar.available,
        maintenance: editingCar.maintenance,
        rating: editingCar.rating
      });
    }
  }, [editingCar]);
  
  // Render car grid item
  const renderCarGridItem = (car: Car) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={car.id}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="160"
              image={car.images[0] || 'https://via.placeholder.com/300x160?text=No+Image'}
              alt={`${car.brand} ${car.model}`}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 1
              }}
            >
              {car.maintenance ? (
                <Chip
                  size="small"
                  icon={<BuildIcon />}
                  label="Maintenance"
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.9),
                    color: 'white'
                  }}
                />
              ) : car.available ? (
                <Chip
                  size="small"
                  icon={<CheckIcon />}
                  label="Available"
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.9),
                    color: 'white'
                  }}
                />
              ) : (
                <Chip
                  size="small"
                  icon={<CloseIcon />}
                  label="Booked"
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.9),
                    color: 'white'
                  }}
                />
              )}
            </Box>
          </Box>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" gutterBottom noWrap>
              {car.brand} {car.model}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                {car.year}
              </Typography>
              <Chip size="small" label={car.category} />
            </Box>
            <Typography variant="h6" color="primary" gutterBottom>
              {formatCurrency(car.price)}/day
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SpeedIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2">{car.topSpeed} km/h</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FuelIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2">{car.fuelType}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2">{car.rating.toFixed(1)}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {car.bookings} bookings
              </Typography>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            <Button 
              size="small" 
              startIcon={<VisibilityIcon />}
              onClick={() => handleViewCar(car.id)}
            >
              View
            </Button>
            <Box>
              <IconButton size="small" onClick={(e) => handleOpenActionMenu(e, car.id)}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      </Grid>
    );
  };
  
  // Render car form dialog
  const renderCarFormDialog = () => {
    const dialogTitle = editingCar ? `Edit ${editingCar.brand} ${editingCar.model}` : 'Add New Car';
    
    return (
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent dividers>
          <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Basic Info" />
            <Tab label="Details" />
            <Tab label="Images" />
            <Tab label="Features" />
          </Tabs>
          
          {/* Basic Info Tab */}
          {currentTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="brand-label">Brand</InputLabel>
                  <Select
                    labelId="brand-label"
                    name="brand"
                    value={newCar.brand}
                    onChange={handleInputChange}
                    label="Brand"
                    required
                  >
                    {availableBrands.map(brand => (
                      <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Model"
                  name="model"
                  value={newCar.model}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Year"
                  name="year"
                  type="number"
                  value={newCar.year}
                  onChange={handleNumberInputChange}
                  InputProps={{ inputProps: { min: 2000, max: 2030 } }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Daily Rental Price (AED)"
                  name="price"
                  type="number"
                  value={newCar.price}
                  onChange={handleNumberInputChange}
                  InputProps={{ 
                    inputProps: { min: 100 },
                    startAdornment: <InputAdornment position="start">AED</InputAdornment>
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={newCar.category}
                    onChange={handleInputChange}
                    label="Category"
                    required
                  >
                    {availableCategories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="transmission-label">Transmission</InputLabel>
                  <Select
                    labelId="transmission-label"
                    name="transmission"
                    value={newCar.transmission}
                    onChange={handleInputChange}
                    label="Transmission"
                    required
                  >
                    {availableTransmissions.map(transmission => (
                      <MenuItem key={transmission} value={transmission}>{transmission}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Description"
                  name="description"
                  value={newCar.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
            </Grid>
          )}
          
          {/* Details Tab */}
          {currentTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Top Speed (km/h)"
                  name="topSpeed"
                  type="number"
                  value={newCar.topSpeed}
                  onChange={handleNumberInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Acceleration (0-100 km/h)"
                  name="acceleration"
                  value={newCar.acceleration}
                  onChange={handleInputChange}
                  placeholder="e.g. 3.2s"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="fuelType-label">Fuel Type</InputLabel>
                  <Select
                    labelId="fuelType-label"
                    name="fuelType"
                    value={newCar.fuelType}
                    onChange={handleInputChange}
                    label="Fuel Type"
                    required
                  >
                    {availableFuelTypes.map(fuelType => (
                      <MenuItem key={fuelType} value={fuelType}>{fuelType}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Rating"
                  name="rating"
                  type="number"
                  value={newCar.rating}
                  onChange={handleNumberInputChange}
                  InputProps={{ 
                    inputProps: { min: 0, max: 5, step: 0.1 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <StarIcon sx={{ color: theme.palette.warning.main }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Availability Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newCar.available}
                          onChange={handleCheckboxChange}
                          name="available"
                          color="success"
                        />
                      }
                      label="Available for Booking"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newCar.maintenance}
                          onChange={handleCheckboxChange}
                          name="maintenance"
                          color="warning"
                        />
                      }
                      label="Under Maintenance"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          
          {/* Images Tab */}
          {currentTab === 2 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Car Images ({tempImages.length} / 5)
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<CloudUploadIcon />}
                  onClick={handleOpenImageUpload}
                  disabled={tempImages.length >= 5}
                >
                  Add Image
                </Button>
              </Box>
              
              {tempImages.length === 0 ? (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    p: 4,
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 1
                  }}
                >
                  <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No images added yet
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<CloudUploadIcon />}
                    onClick={handleOpenImageUpload}
                    sx={{ mt: 1 }}
                  >
                    Add Image
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {tempImages.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={image}
                          alt={`Car image ${index + 1}`}
                        />
                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                          <IconButton 
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.common.black, 0.7),
                              color: theme.palette.common.white,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.common.black, 0.9),
                              }
                            }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: alpha(theme.palette.common.black, 0.7),
                            color: theme.palette.common.white,
                            px: 2,
                            py: 1
                          }}
                        >
                          <Typography variant="body2">
                            {index === 0 ? 'Primary Image' : `Image ${index + 1}`}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                * The first image will be used as the primary display image
              </Typography>
            </>
          )}
          
          {/* Features Tab */}
          {currentTab === 3 && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel id="features-label">Features</InputLabel>
                <Select
                  labelId="features-label"
                  multiple
                  value={newCar.features}
                  onChange={handleFeaturesChange}
                  input={<OutlinedInput label="Features" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableFeatures.map((feature) => (
                    <MenuItem key={feature} value={feature}>
                      <Checkbox checked={newCar.features.indexOf(feature) > -1} />
                      <ListItemText primary={feature} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                * Select all the features that apply to this car
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveCar}
            startIcon={<SaveIcon />}
            disabled={
              !newCar.brand || 
              !newCar.model || 
              !newCar.category || 
              !newCar.transmission || 
              !newCar.fuelType ||
              tempImages.length === 0
            }
          >
            {editingCar ? 'Update' : 'Add'} Car
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  // Render image upload dialog
  const renderImageUploadDialog = () => {
    const [imageUrl, setImageUrl] = useState('');
    
    return (
      <Dialog 
        open={imageUploadDialog} 
        onClose={handleCloseImageUpload}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Image</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enter the URL of the image you want to add:
          </Typography>
          <TextField
            fullWidth
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            margin="normal"
          />
          {imageUrl && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview:
              </Typography>
              <Box
                component="img"
                src={imageUrl}
                alt="Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  objectFit: 'contain',
                  mt: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageUpload}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleAddImageUrl(imageUrl)}
            disabled={!imageUrl}
          >
            Add Image
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  // Render delete confirmation dialog
  const renderDeleteConfirmDialog = () => {
    return (
      <Dialog
        open={deleteConfirmDialog}
        onClose={() => setDeleteConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete{' '}
            <strong>{carToDelete?.brand} {carToDelete?.model}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone. All related bookings and data will be affected.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDeleteCar}
            startIcon={<DeleteForeverIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Car Inventory
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddCar}
        >
          Add New Car
        </Button>
      </Box>
      
      {/* Filters and search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
              size="small"
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleOpenFilterMenu}
              size="medium"
              endIcon={
                Object.values(filters).some(value => 
                  Array.isArray(value) ? value.length > 0 : value !== null
                ) ? (
                  <Chip 
                    size="small" 
                    label={
                      Object.values(filters).reduce((count, value) => 
                        count + (Array.isArray(value) ? value.length : (value !== null ? 1 : 0)), 0
                      )
                    } 
                    color="primary"
                  />
                ) : undefined
              }
            >
              Filters
            </Button>
          </Grid>
          <Grid item sx={{ flexGrow: 1 }} />
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('table')}
                size="small"
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('grid')}
                size="small"
              >
                Grid
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Active filters display */}
        {Object.values(filters).some(value => 
          Array.isArray(value) ? value.length > 0 : value !== null
        ) && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.brands.map(brand => (
              <Chip
                key={`brand-${brand}`}
                label={brand}
                onDelete={() => handleFilterChange('brands', brand)}
                size="small"
              />
            ))}
            
            {filters.categories.map(category => (
              <Chip
                key={`category-${category}`}
                label={category}
                onDelete={() => handleFilterChange('categories', category)}
                size="small"
              />
            ))}
            
            {filters.available !== null && (
              <Chip
                label={filters.available ? 'Available' : 'Not Available'}
                onDelete={() => handleFilterChange('available', null)}
                size="small"
              />
            )}
            
            {filters.maintenance !== null && (
              <Chip
                label={filters.maintenance ? 'Under Maintenance' : 'Not in Maintenance'}
                onDelete={() => handleFilterChange('maintenance', null)}
                size="small"
              />
            )}
            
            <Button
              size="small"
              startIcon={<CloseIcon />}
              onClick={resetFilters}
            >
              Clear All
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Cars display (table or grid) */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredCars.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            No cars found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters, or add a new car.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCar}
            sx={{ mt: 2 }}
          >
            Add New Car
          </Button>
        </Paper>
      ) : viewMode === 'table' ? (
        <Paper sx={{ height: 600, width: '100%', borderRadius: 2 }}>
          <DataGrid
            rows={filteredCars}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }
            }}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredCars.map(car => renderCarGridItem(car))}
        </Grid>
      )}
      
      {/* Car form dialog */}
      {renderCarFormDialog()}
      
      {/* Image upload dialog */}
      {renderImageUploadDialog()}
      
      {/* Delete confirmation dialog */}
      {renderDeleteConfirmDialog()}
      
      {/* Filter menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleCloseFilterMenu}
        PaperProps={{
          sx: { width: 300, maxHeight: 500, p: 1 }
        }}
      >
        <Typography variant="subtitle1" sx={{ px: 2, py: 1 }}>
          Filter Cars
        </Typography>
        <Divider sx={{ mb: 1 }} />
        
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Brands
        </Typography>
        <List dense sx={{ pt: 0 }}>
          {availableBrands.slice(0, 8).map(brand => (
            <MenuItem key={brand} onClick={() => handleFilterChange('brands', brand)}>
              <Checkbox 
                checked={filters.brands.includes(brand)} 
                size="small"
              />
              <ListItemText primary={brand} />
            </MenuItem>
          ))}
        </List>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Categories
        </Typography>
        <List dense sx={{ pt: 0 }}>
          {availableCategories.map(category => (
            <MenuItem key={category} onClick={() => handleFilterChange('categories', category)}>
              <Checkbox 
                checked={filters.categories.includes(category)} 
                size="small"
              />
              <ListItemText primary={category} />
            </MenuItem>
          ))}
        </List>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Availability
        </Typography>
        <List dense sx={{ pt: 0 }}>
          <MenuItem onClick={() => handleFilterChange('available', filters.available === true ? null : true)}>
            <Checkbox 
              checked={filters.available === true} 
              indeterminate={filters.available === null}
              size="small"
            />
            <ListItemText primary="Available" />
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange('available', filters.available === false ? null : false)}>
            <Checkbox 
              checked={filters.available === false} 
              indeterminate={filters.available === null}
              size="small"
            />
            <ListItemText primary="Not Available" />
          </MenuItem>
        </List>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          Maintenance
        </Typography>
        <List dense sx={{ pt: 0 }}>
          <MenuItem onClick={() => handleFilterChange('maintenance', filters.maintenance === true ? null : true)}>
            <Checkbox 
              checked={filters.maintenance === true} 
              indeterminate={filters.maintenance === null}
              size="small"
            />
            <ListItemText primary="Under Maintenance" />
          </MenuItem>
          <MenuItem onClick={() => handleFilterChange('maintenance', filters.maintenance === false ? null : false)}>
            <Checkbox 
              checked={filters.maintenance === false} 
              indeterminate={filters.maintenance === null}
              size="small"
            />
            <ListItemText primary="Not in Maintenance" />
          </MenuItem>
        </List>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, mt: 1 }}>
          <Button size="small" onClick={resetFilters}>
            Reset
          </Button>
          <Button size="small" variant="contained" onClick={handleCloseFilterMenu} sx={{ ml: 1 }}>
            Apply
          </Button>
        </Box>
      </Menu>
      
      {/* Action menu */}
      <Menu
        anchorEl={actionMenuAnchor.el}
        open={Boolean(actionMenuAnchor.el)}
        onClose={handleCloseActionMenu}
      >
        <MenuItem onClick={() => actionMenuAnchor.carId && handleViewCar(actionMenuAnchor.carId)}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => actionMenuAnchor.carId && handleEditCar(actionMenuAnchor.carId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => actionMenuAnchor.carId && handleDeleteCar(actionMenuAnchor.carId)}
          sx={{ color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCars;
