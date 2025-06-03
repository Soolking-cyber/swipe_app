import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Divider,
  useMediaQuery,
  IconButton,
  Drawer,
  styled
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

// Define filter interfaces
interface PriceRange {
  min: number;
  max: number;
}

interface CarFiltersProps {
  onFilterChange: (filters: CarFilters) => void;
  initialFilters?: CarFilters;
}

export interface CarFilters {
  priceRange: PriceRange;
  brands: string[];
  categories: string[];
  years: number[];
  transmissions: string[];
  features: string[];
  sortBy: string;
  search: string;
}

// Styled components
const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  '& .MuiChip-deleteIcon': {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      color: theme.palette.primary.contrastText,
    },
  },
}));

const FilterButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const MobileFilterButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  borderRadius: '50%',
  width: 60,
  height: 60,
  minWidth: 'auto',
  boxShadow: theme.shadows[6],
}));

// Available filter options
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

const availableFeatures = [
  'Leather Interior', 'Panoramic Roof', 'Sport Package', 'Premium Sound System',
  'Adaptive Cruise Control', 'Heated Seats', 'Cooled Seats', 'Massage Seats',
  'Night Vision', 'Head-up Display', '360° Camera', 'Self-Driving Capability'
];

const availableSortOptions = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' }
];

// Generate years from current year back to 2010
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 2010; year--) {
    years.push(year);
  }
  return years;
};

const availableYears = generateYears();

// Default filters
const defaultFilters: CarFilters = {
  priceRange: { min: 500, max: 10000 },
  brands: [],
  categories: [],
  years: [],
  transmissions: [],
  features: [],
  sortBy: 'popularity',
  search: ''
};

const CarFilters: React.FC<CarFiltersProps> = ({ onFilterChange, initialFilters }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filters, setFilters] = useState<CarFilters>(initialFilters || defaultFilters);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.brands.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.years.length > 0) count++;
    if (filters.transmissions.length > 0) count++;
    if (filters.features.length > 0) count++;
    if (filters.search) count++;
    if (
      filters.priceRange.min !== defaultFilters.priceRange.min ||
      filters.priceRange.max !== defaultFilters.priceRange.max
    ) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Handle price range change
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const newFilters = {
        ...filters,
        priceRange: { min: newValue[0], max: newValue[1] }
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  // Handle checkbox filters (brands, categories, features, etc.)
  const handleCheckboxChange = (filterType: keyof CarFilters, value: string | number) => {
    const currentValues = filters[filterType] as (string | number)[];
    let newValues: (string | number)[];
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(item => item !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    const newFilters = { ...filters, [filterType]: newValues };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle sort option change
  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newFilters = { ...filters, sortBy: event.target.value as string };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: event.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Remove a single filter
  const handleRemoveFilter = (filterType: keyof CarFilters, value?: string | number) => {
    let newFilters: CarFilters;
    
    if (filterType === 'priceRange') {
      newFilters = {
        ...filters,
        priceRange: defaultFilters.priceRange
      };
    } else if (filterType === 'search') {
      newFilters = { ...filters, search: '' };
    } else if (value !== undefined) {
      const currentValues = filters[filterType] as (string | number)[];
      const newValues = currentValues.filter(item => item !== value);
      newFilters = { ...filters, [filterType]: newValues };
    } else {
      newFilters = { ...filters, [filterType]: [] };
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Toggle mobile filter drawer
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Render active filters as chips
  const renderActiveFilters = () => {
    if (activeFiltersCount === 0) return null;
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, mb: 2 }}>
        <Typography variant="body2" sx={{ mr: 1, mt: 0.5 }}>
          Active Filters:
        </Typography>
        
        {filters.priceRange.min !== defaultFilters.priceRange.min || 
         filters.priceRange.max !== defaultFilters.priceRange.max ? (
          <FilterChip
            label={`AED ${filters.priceRange.min.toLocaleString()} - ${filters.priceRange.max.toLocaleString()}`}
            onDelete={() => handleRemoveFilter('priceRange')}
          />
        ) : null}
        
        {filters.search && (
          <FilterChip
            label={`Search: ${filters.search}`}
            onDelete={() => handleRemoveFilter('search')}
          />
        )}
        
        {filters.brands.map(brand => (
          <FilterChip
            key={`brand-${brand}`}
            label={brand}
            onDelete={() => handleRemoveFilter('brands', brand)}
          />
        ))}
        
        {filters.categories.map(category => (
          <FilterChip
            key={`category-${category}`}
            label={category}
            onDelete={() => handleRemoveFilter('categories', category)}
          />
        ))}
        
        {filters.years.map(year => (
          <FilterChip
            key={`year-${year}`}
            label={`${year}`}
            onDelete={() => handleRemoveFilter('years', year)}
          />
        ))}
        
        {filters.transmissions.map(transmission => (
          <FilterChip
            key={`transmission-${transmission}`}
            label={transmission}
            onDelete={() => handleRemoveFilter('transmissions', transmission)}
          />
        ))}
        
        {filters.features.map(feature => (
          <FilterChip
            key={`feature-${feature}`}
            label={feature}
            onDelete={() => handleRemoveFilter('features', feature)}
          />
        ))}
        
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleResetFilters}
            sx={{ ml: 1, mt: 0.5 }}
          >
            Clear All
          </Button>
        )}
      </Box>
    );
  };

  // Main filter content
  const filterContent = (
    <>
      <Box sx={{ p: isMobile ? 2 : 0 }}>
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleMobileDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        
        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by brand, model or feature"
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: filters.search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFilter('search')}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />
        </Box>
        
        {/* Sort By */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={filters.sortBy}
              onChange={handleSortChange}
              label="Sort By"
            >
              {availableSortOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Price Range */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">Price Range (AED/day)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 2 }}>
              <Slider
                value={[filters.priceRange.min, filters.priceRange.max]}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={500}
                max={10000}
                step={100}
                marks={[
                  { value: 500, label: '500' },
                  { value: 2500, label: '2,500' },
                  { value: 5000, label: '5,000' },
                  { value: 7500, label: '7,500' },
                  { value: 10000, label: '10,000' }
                ]}
                sx={{
                  color: theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    height: 20,
                    width: 20,
                  },
                  '& .MuiSlider-valueLabel': {
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2">
                  AED {filters.priceRange.min.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  AED {filters.priceRange.max.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        {/* Car Categories */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">Car Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {availableCategories.map(category => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCheckboxChange('categories', category)}
                      color="primary"
                    />
                  }
                  label={category}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        
        {/* Brands */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">Brands</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {availableBrands.map(brand => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleCheckboxChange('brands', brand)}
                      color="primary"
                    />
                  }
                  label={brand}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        
        {/* Year */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">Year</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {availableYears.map(year => (
                <FormControlLabel
                  key={year}
                  control={
                    <Checkbox
                      checked={filters.years.includes(year)}
                      onChange={() => handleCheckboxChange('years', year)}
                      color="primary"
                    />
                  }
                  label={year}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        
        {/* Transmission */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">Transmission</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {availableTransmissions.map(transmission => (
                <FormControlLabel
                  key={transmission}
                  control={
                    <Checkbox
                      checked={filters.transmissions.includes(transmission)}
                      onChange={() => handleCheckboxChange('transmissions', transmission)}
                      color="primary"
                    />
                  }
                  label={transmission}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        
        {/* Features */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">Features</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {availableFeatures.map(feature => (
                <FormControlLabel
                  key={feature}
                  control={
                    <Checkbox
                      checked={filters.features.includes(feature)}
                      onChange={() => handleCheckboxChange('features', feature)}
                      color="primary"
                    />
                  }
                  label={feature}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        
        {isMobile && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              onClick={handleResetFilters}
              startIcon={<ClearIcon />}
            >
              Reset
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={toggleMobileDrawer}
            >
              Apply Filters
            </Button>
          </Box>
        )}
      </Box>
    </>
  );

  // Render desktop or mobile version
  if (isMobile) {
    return (
      <>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterButton 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                onClick={toggleMobileDrawer}
                size="small"
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </FilterButton>
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  displayEmpty
                >
                  {availableSortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          {renderActiveFilters()}
        </Box>
        
        <Drawer
          anchor="right"
          open={mobileDrawerOpen}
          onClose={toggleMobileDrawer}
          PaperProps={{
            sx: { width: '85%', maxWidth: '400px' }
          }}
        >
          {filterContent}
        </Drawer>
        
        <MobileFilterButton
          variant="contained"
          color="primary"
          onClick={toggleMobileDrawer}
        >
          <FilterListIcon />
        </MobileFilterButton>
      </>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Refine Your Search</Typography>
      {filterContent}
      {renderActiveFilters()}
    </Paper>
  );
};

export default CarFilters;
