import express, { Request, Response } from 'express';
import { Car, ICar } from '../models';
import { authenticateJWT, authorize } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/cars
 * @desc    Get all cars with filtering, sorting, and pagination
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Build query
    let query: any = {};
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Handle specific filters
    if (reqQuery.brand) {
      query.brand = { $in: Array.isArray(reqQuery.brand) ? reqQuery.brand : [reqQuery.brand] };
    }
    
    if (reqQuery.category) {
      query.category = { $in: Array.isArray(reqQuery.category) ? reqQuery.category : [reqQuery.category] };
    }
    
    if (reqQuery.year) {
      query.year = { $in: Array.isArray(reqQuery.year) ? reqQuery.year : [reqQuery.year] };
    }
    
    if (reqQuery.transmission) {
      query.transmission = { $in: Array.isArray(reqQuery.transmission) ? reqQuery.transmission : [reqQuery.transmission] };
    }
    
    if (reqQuery.fuelType) {
      query.fuelType = { $in: Array.isArray(reqQuery.fuelType) ? reqQuery.fuelType : [reqQuery.fuelType] };
    }
    
    // Handle price range
    if (reqQuery.minPrice || reqQuery.maxPrice) {
      query.price = {};
      if (reqQuery.minPrice) query.price.$gte = Number(reqQuery.minPrice);
      if (reqQuery.maxPrice) query.price.$lte = Number(reqQuery.maxPrice);
    }
    
    // Handle features (car must have ALL selected features)
    if (reqQuery.features) {
      const features = Array.isArray(reqQuery.features) ? reqQuery.features : [reqQuery.features];
      query.features = { $all: features };
    }
    
    // Handle availability
    if (reqQuery.available !== undefined) {
      query.available = reqQuery.available === 'true';
    }
    
    if (reqQuery.maintenance !== undefined) {
      query.maintenance = reqQuery.maintenance === 'true';
    }
    
    // Handle search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [
        { brand: searchRegex },
        { model: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { features: searchRegex }
      ];
    }
    
    // Finding resource
    let result = Car.find(query);
    
    // Select fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(',').join(' ');
      result = result.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      result = result.sort(sortBy);
    } else {
      result = result.sort('-addedDate');
    }
    
    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Car.countDocuments(query);
    
    result = result.skip(startIndex).limit(limit);
    
    // Execute query
    const cars = await result;
    
    // Pagination result
    const pagination: any = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: cars.length,
      pagination,
      total,
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/cars/:id
 * @desc    Get single car
 * @access  Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate({
        path: 'reviews',
        select: 'rating comment user createdAt',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });
      
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/cars/featured/popular
 * @desc    Get popular cars
 * @access  Public
 */
router.get('/featured/popular', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 6;
    
    const cars = await Car.find({ available: true })
      .sort({ rating: -1, bookings: -1 })
      .limit(limit);
      
    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/cars/categories/list
 * @desc    Get list of available categories
 * @access  Public
 */
router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    const categories = await Car.distinct('category');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/cars/brands/list
 * @desc    Get list of available brands
 * @access  Public
 */
router.get('/brands/list', async (req: Request, res: Response) => {
  try {
    const brands = await Car.distinct('brand');
    
    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/cars
 * @desc    Create new car
 * @access  Private/Admin
 */
router.post('/', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    // Check if license plate or VIN already exists
    const { licensePlate, vin } = req.body;
    
    const existingCar = await Car.findOne({
      $or: [
        { licensePlate },
        { vin }
      ]
    });
    
    if (existingCar) {
      return res.status(400).json({
        success: false,
        error: 'A car with this license plate or VIN already exists'
      });
    }
    
    // Create car
    const car = await Car.create(req.body);
    
    res.status(201).json({
      success: true,
      data: car
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/cars/:id
 * @desc    Update car
 * @access  Private/Admin
 */
router.put('/:id', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    let car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    // Check if updating license plate or VIN and if they already exist
    if (req.body.licensePlate && req.body.licensePlate !== car.licensePlate) {
      const existingLicensePlate = await Car.findOne({ licensePlate: req.body.licensePlate });
      
      if (existingLicensePlate) {
        return res.status(400).json({
          success: false,
          error: 'A car with this license plate already exists'
        });
      }
    }
    
    if (req.body.vin && req.body.vin !== car.vin) {
      const existingVin = await Car.findOne({ vin: req.body.vin });
      
      if (existingVin) {
        return res.status(400).json({
          success: false,
          error: 'A car with this VIN already exists'
        });
      }
    }
    
    // Update car
    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/cars/:id
 * @desc    Delete car
 * @access  Private/Admin
 */
router.delete('/:id', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    // Check if car has active bookings
    if (car.bookings && car.bookings.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete car with active bookings'
      });
    }
    
    await car.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/cars/:id/availability
 * @desc    Toggle car availability
 * @access  Private/Admin
 */
router.put('/:id/availability', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { available } = req.body;
    
    if (available === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please provide availability status'
      });
    }
    
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { available },
      { new: true, runValidators: true }
    );
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/cars/:id/maintenance
 * @desc    Toggle car maintenance status
 * @access  Private/Admin
 */
router.put('/:id/maintenance', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { maintenance } = req.body;
    
    if (maintenance === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please provide maintenance status'
      });
    }
    
    // If putting car in maintenance, also set available to false
    const updateData: any = { maintenance };
    if (maintenance === true) {
      updateData.available = false;
    }
    
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/cars/stats/overview
 * @desc    Get car statistics overview
 * @access  Private/Admin
 */
router.get('/stats/overview', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const totalCars = await Car.countDocuments();
    const availableCars = await Car.countDocuments({ available: true, maintenance: false });
    const maintenanceCars = await Car.countDocuments({ maintenance: true });
    const bookedCars = await Car.countDocuments({ available: false, maintenance: false });
    
    const categoryCounts = await Car.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const brandCounts = await Car.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalCars,
        availableCars,
        maintenanceCars,
        bookedCars,
        categoryCounts,
        brandCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/cars/:id/images
 * @desc    Add images to a car
 * @access  Private/Admin
 */
router.post('/:id/images', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { images } = req.body;
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one image URL'
      });
    }
    
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    // Add new images
    car.images = [...car.images, ...images];
    
    await car.save();
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/cars/:id/images/:index
 * @desc    Remove an image from a car
 * @access  Private/Admin
 */
router.delete('/:id/images/:index', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    const index = parseInt(req.params.index, 10);
    
    if (isNaN(index) || index < 0 || index >= car.images.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image index'
      });
    }
    
    // Remove image at specified index
    car.images.splice(index, 1);
    
    // Ensure car has at least one image
    if (car.images.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Car must have at least one image'
      });
    }
    
    await car.save();
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
