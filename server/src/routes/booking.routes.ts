import express, { Request, Response } from 'express';
import { Booking, Car, Payment, User, IBooking } from '../models';
import { authenticateJWT, authorize, checkOwnership } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const {
      carId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      additionalDrivers,
      additionalServices,
      notes
    } = req.body;

    // Validate required fields
    if (!carId || !startDate || !endDate || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    // Check if car is available
    if (!car.available || car.maintenance) {
      return res.status(400).json({
        success: false,
        error: 'Car is not available for booking'
      });
    }

    // Parse dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Validate dates
    if (parsedStartDate < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Start date cannot be in the past'
      });
    }

    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date'
      });
    }

    // Check if car is already booked for the requested dates
    const conflictingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        // New booking starts during an existing booking
        {
          startDate: { $lte: parsedStartDate },
          endDate: { $gte: parsedStartDate }
        },
        // New booking ends during an existing booking
        {
          startDate: { $lte: parsedEndDate },
          endDate: { $gte: parsedEndDate }
        },
        // New booking completely contains an existing booking
        {
          startDate: { $gte: parsedStartDate },
          endDate: { $lte: parsedEndDate }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        error: 'Car is already booked for the selected dates'
      });
    }

    // Calculate rental duration in days
    const durationMs = parsedEndDate.getTime() - parsedStartDate.getTime();
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    // Calculate base price
    let totalPrice = car.price * durationDays;

    // Add cost of additional services
    if (additionalServices && additionalServices.length > 0) {
      const additionalServicesTotal = additionalServices.reduce(
        (sum: number, service: { price: number }) => sum + service.price,
        0
      );
      totalPrice += additionalServicesTotal;
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user!._id,
      car: carId,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      pickupLocation,
      dropoffLocation,
      totalPrice,
      status: 'pending',
      additionalDrivers,
      additionalServices,
      notes
    });

    // Add booking reference to car
    car.bookings.push(booking._id);
    await car.save();

    // Get the io instance
    const io = req.app.get('io');
    if (io) {
      // Notify admin about new booking
      io.to('admin').emit('new_booking', {
        bookingId: booking._id,
        carModel: `${car.brand} ${car.model}`,
        customerName: req.user!.name
      });
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (admin) or user's bookings
 * @access  Private
 */
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    // Build query
    let query: any = {};

    // If not admin, only show user's own bookings
    if (req.user!.role !== 'admin') {
      query.user = req.user!._id;
    } else if (req.query.userId) {
      // Admin can filter by userId
      query.user = req.query.userId;
    }

    // Filter by car
    if (req.query.carId) {
      query.car = req.query.carId;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range
    if (req.query.from || req.query.to) {
      query.startDate = {};
      if (req.query.from) {
        query.startDate.$gte = new Date(req.query.from as string);
      }
      if (req.query.to) {
        query.startDate.$lte = new Date(req.query.to as string);
      }
    }

    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Booking.countDocuments(query);

    // Find bookings
    const bookings = await Booking.find(query)
      .populate({
        path: 'car',
        select: 'brand model year images price category'
      })
      .populate({
        path: 'user',
        select: 'name email phone avatar'
      })
      .populate({
        path: 'payment',
        select: 'amount status method paymentDate'
      })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination: any = {};

    if (startIndex + limit < total) {
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
      count: bookings.length,
      pagination,
      total,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking
 * @access  Private
 */
router.get('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'car',
        select: 'brand model year images price category features topSpeed acceleration fuelType transmission'
      })
      .populate({
        path: 'user',
        select: 'name email phone avatar address drivingLicense'
      })
      .populate({
        path: 'payment',
        select: 'amount status method paymentDate transactionId receiptUrl'
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    if (req.user!.role !== 'admin' && booking.user._id.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking
 * @access  Private
 */
router.put('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is authorized to update this booking
    if (req.user!.role !== 'admin' && booking.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this booking'
      });
    }

    // Users can only update certain fields
    if (req.user!.role !== 'admin') {
      // Only allow updates to notes and additionalDrivers for regular users
      const allowedUpdates = ['notes', 'additionalDrivers'];
      const requestedUpdates = Object.keys(req.body);
      
      const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));
      
      if (!isValidOperation) {
        return res.status(400).json({
          success: false,
          error: 'You can only update notes and additional drivers'
        });
      }
      
      // Only allow updates if booking is in pending status
      if (booking.status !== 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Cannot update booking once it has been confirmed'
        });
      }
    } else {
      // Admin can update status
      if (req.body.status) {
        const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(req.body.status)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid status'
          });
        }
        
        // Handle status transitions
        if (req.body.status === 'cancelled') {
          // Store cancellation reason if provided
          if (req.body.cancellationReason) {
            booking.cancellationReason = req.body.cancellationReason;
          }
          
          // If booking was confirmed or active, make car available again
          if (booking.status === 'confirmed' || booking.status === 'active') {
            const car = await Car.findById(booking.car);
            if (car) {
              car.available = true;
              await car.save();
            }
          }
        } 
        else if (req.body.status === 'confirmed') {
          // When confirming a booking, mark the car as unavailable for the booking period
          const car = await Car.findById(booking.car);
          if (car) {
            // Only mark as unavailable if the start date is within the next 24 hours
            const now = new Date();
            const bookingStart = new Date(booking.startDate);
            const timeDiff = bookingStart.getTime() - now.getTime();
            const daysDiff = timeDiff / (1000 * 3600 * 24);
            
            if (daysDiff <= 1) {
              car.available = false;
              await car.save();
            }
          }
        }
        else if (req.body.status === 'active') {
          // When booking becomes active, mark car as unavailable
          const car = await Car.findById(booking.car);
          if (car) {
            car.available = false;
            await car.save();
          }
        }
        else if (req.body.status === 'completed') {
          // When booking is completed, make car available again
          const car = await Car.findById(booking.car);
          if (car) {
            car.available = true;
            await car.save();
          }
        }
      }
      
      // Admin can update dates if booking is still pending
      if ((req.body.startDate || req.body.endDate) && booking.status === 'pending') {
        // If updating dates, check for conflicts
        const startDate = req.body.startDate ? new Date(req.body.startDate) : booking.startDate;
        const endDate = req.body.endDate ? new Date(req.body.endDate) : booking.endDate;
        
        // Validate dates
        if (startDate < new Date()) {
          return res.status(400).json({
            success: false,
            error: 'Start date cannot be in the past'
          });
        }

        if (endDate <= startDate) {
          return res.status(400).json({
            success: false,
            error: 'End date must be after start date'
          });
        }
        
        // Check for conflicts
        const conflictingBooking = await Booking.findOne({
          car: booking.car,
          _id: { $ne: booking._id }, // Exclude current booking
          status: { $in: ['pending', 'confirmed', 'active'] },
          $or: [
            {
              startDate: { $lte: startDate },
              endDate: { $gte: startDate }
            },
            {
              startDate: { $lte: endDate },
              endDate: { $gte: endDate }
            },
            {
              startDate: { $gte: startDate },
              endDate: { $lte: endDate }
            }
          ]
        });

        if (conflictingBooking) {
          return res.status(400).json({
            success: false,
            error: 'Car is already booked for the selected dates'
          });
        }
        
        // Recalculate total price if dates changed
        if (req.body.startDate || req.body.endDate) {
          const car = await Car.findById(booking.car);
          if (car) {
            const durationMs = endDate.getTime() - startDate.getTime();
            const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
            
            // Calculate base price
            let totalPrice = car.price * durationDays;
            
            // Add cost of additional services
            if (booking.additionalServices && booking.additionalServices.length > 0) {
              const additionalServicesTotal = booking.additionalServices.reduce(
                (sum: number, service: { price: number }) => sum + service.price,
                0
              );
              totalPrice += additionalServicesTotal;
            }
            
            req.body.totalPrice = totalPrice;
          }
        }
      }
    }

    // Update booking
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Get the io instance
    const io = req.app.get('io');
    if (io) {
      // Notify user about booking status change
      if (req.body.status && req.body.status !== booking.status) {
        io.to(booking.user.toString()).emit('booking_update', {
          bookingId: booking._id,
          status: req.body.status
        });
      }
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel booking
 * @access  Private
 */
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user is authorized to cancel this booking
    if (req.user!.role !== 'admin' && booking.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'active' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel an active or completed booking'
      });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();

    // If booking was confirmed, make car available again
    if (booking.status === 'confirmed') {
      const car = await Car.findById(booking.car);
      if (car) {
        car.available = true;
        await car.save();
      }
    }

    // If there was a payment, initiate refund process
    if (booking.payment) {
      const payment = await Payment.findById(booking.payment);
      if (payment && payment.status === 'completed') {
        // In a real app, this would call a payment gateway API to process refund
        payment.status = 'refunded';
        payment.refundAmount = payment.amount;
        payment.refundReason = booking.cancellationReason;
        await payment.save();
      }
    }

    // Get the io instance
    const io = req.app.get('io');
    if (io) {
      // Notify admin about cancelled booking
      io.to('admin').emit('booking_cancelled', {
        bookingId: booking._id,
        userId: booking.user
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/bookings/user/current
 * @desc    Get current user's bookings
 * @access  Private
 */
router.get('/user/current', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ user: req.user!._id })
      .populate({
        path: 'car',
        select: 'brand model year images price category'
      })
      .populate({
        path: 'payment',
        select: 'amount status method paymentDate'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/bookings/car/:carId
 * @desc    Get bookings for a specific car
 * @access  Private/Admin
 */
router.get('/car/:carId', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ car: req.params.carId })
      .populate({
        path: 'user',
        select: 'name email phone avatar'
      })
      .populate({
        path: 'payment',
        select: 'amount status method paymentDate'
      })
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/bookings/stats/overview
 * @desc    Get booking statistics overview
 * @access  Private/Admin
 */
router.get('/stats/overview', authenticateJWT, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'active' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Total revenue
    const revenueStats = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'active', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // Monthly bookings (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' }, 
            month: { $month: '$createdAt' } 
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Most popular cars
    const popularCars = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'active', 'completed'] } } },
      { $group: { _id: '$car', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'cars',
          localField: '_id',
          foreignField: '_id',
          as: 'carDetails'
        }
      },
      { $unwind: '$carDetails' },
      {
        $project: {
          _id: 1,
          count: 1,
          brand: '$carDetails.brand',
          model: '$carDetails.model',
          category: '$carDetails.category',
          image: { $arrayElemAt: ['$carDetails.images', 0] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        activeBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        monthlyBookings,
        popularCars
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
 * @route   GET /api/bookings/availability/:carId
 * @desc    Check car availability for given dates
 * @access  Public
 */
router.get('/availability/:carId', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide start and end dates'
      });
    }
    
    const parsedStartDate = new Date(startDate as string);
    const parsedEndDate = new Date(endDate as string);
    
    // Check if car exists
    const car = await Car.findById(req.params.carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    // Check if car is under maintenance
    if (car.maintenance) {
      return res.status(200).json({
        success: true,
        available: false,
        reason: 'Car is under maintenance'
      });
    }
    
    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      car: req.params.carId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: parsedStartDate },
          endDate: { $gte: parsedStartDate }
        },
        {
          startDate: { $lte: parsedEndDate },
          endDate: { $gte: parsedEndDate }
        },
        {
          startDate: { $gte: parsedStartDate },
          endDate: { $lte: parsedEndDate }
        }
      ]
    });
    
    const available = !conflictingBooking;
    
    res.status(200).json({
      success: true,
      available,
      reason: available ? null : 'Car is already booked for the selected dates'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/bookings/calendar/:carId
 * @desc    Get booking calendar for a car
 * @access  Public
 */
router.get('/calendar/:carId', async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    
    // Default to current month and year if not provided
    const currentDate = new Date();
    const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month as string) - 1 : currentDate.getMonth();
    
    // Create date range for the month
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
    
    // Find bookings for this car in the given month
    const bookings = await Booking.find({
      car: req.params.carId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        // Booking starts in the target month
        {
          startDate: { $gte: startOfMonth, $lte: endOfMonth }
        },
        // Booking ends in the target month
        {
          endDate: { $gte: startOfMonth, $lte: endOfMonth }
        },
        // Booking spans the entire month
        {
          startDate: { $lte: startOfMonth },
          endDate: { $gte: endOfMonth }
        }
      ]
    }).select('startDate endDate status');
    
    // Create calendar data
    const calendarDays = [];
    const daysInMonth = endOfMonth.getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(targetYear, targetMonth, day);
      
      // Check if this day is booked
      const isBooked = bookings.some(booking => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        return currentDate >= bookingStart && currentDate <= bookingEnd;
      });
      
      calendarDays.push({
        date: currentDate.toISOString().split('T')[0],
        available: !isBooked
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        year: targetYear,
        month: targetMonth + 1,
        days: calendarDays
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
