import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  drivingLicense?: {
    number: string;
    expiryDate: Date;
    country: string;
    verified: boolean;
  };
  favorites: mongoose.Types.ObjectId[];
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  getSignedJwtToken: () => string;
  getResetPasswordToken: () => string;
}

// Car Interface
export interface ICar extends Document {
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
  bookings: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
  licensePlate: string;
  vin: string; // Vehicle Identification Number
  mileage: number;
  lastService: Date;
  nextService: Date;
  addedDate: Date;
  lastUpdated: Date;
}

// Booking Interface
export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  payment: mongoose.Types.ObjectId;
  additionalDrivers?: {
    name: string;
    licenseNumber: string;
    licenseExpiry: Date;
  }[];
  additionalServices?: {
    name: string;
    price: number;
  }[];
  notes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Interface
export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  refundAmount?: number;
  refundReason?: string;
  receiptUrl?: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Review Interface
export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  photos?: string[];
  likes: number;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  drivingLicense: {
    number: String,
    expiryDate: Date,
    country: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Encrypt password using bcrypt
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Car Schema
const CarSchema: Schema = new Schema({
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please add a model'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Please add a year'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  price: {
    type: Number,
    required: [true, 'Please add a daily rental price'],
    min: [0, 'Price must be positive']
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image'],
    validate: [(val: string[]) => val.length > 0, 'Car must have at least one image']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  features: {
    type: [String],
    required: [true, 'Please add features']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Luxury Sedan', 'Sports Car', 'Super Car', 'Luxury SUV', 'Convertible', 'Coupe', 'Grand Tourer', 'Electric']
  },
  topSpeed: {
    type: Number,
    required: [true, 'Please add top speed']
  },
  acceleration: {
    type: String,
    required: [true, 'Please add acceleration time']
  },
  fuelType: {
    type: String,
    required: [true, 'Please add fuel type'],
    enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric']
  },
  transmission: {
    type: String,
    required: [true, 'Please add transmission type'],
    enum: ['Automatic', 'Manual', 'Semi-Automatic']
  },
  available: {
    type: Boolean,
    default: true
  },
  maintenance: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  licensePlate: {
    type: String,
    required: [true, 'Please add a license plate number'],
    unique: true
  },
  vin: {
    type: String,
    required: [true, 'Please add a VIN'],
    unique: true
  },
  mileage: {
    type: Number,
    required: [true, 'Please add current mileage'],
    min: [0, 'Mileage must be positive']
  },
  lastService: {
    type: Date,
    required: [true, 'Please add last service date']
  },
  nextService: {
    type: Date,
    required: [true, 'Please add next service date']
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the lastUpdated date on save
CarSchema.pre<ICar>('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Booking Schema
const BookingSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user']
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Please add a car']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  pickupLocation: {
    type: String,
    required: [true, 'Please add a pickup location']
  },
  dropoffLocation: {
    type: String,
    required: [true, 'Please add a dropoff location']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please add a total price']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  additionalDrivers: [{
    name: String,
    licenseNumber: String,
    licenseExpiry: Date
  }],
  additionalServices: [{
    name: String,
    price: Number
  }],
  notes: String,
  cancellationReason: String
}, {
  timestamps: true
});

// Validate that endDate is after startDate
BookingSchema.pre<IBooking>('save', function(next) {
  if (this.endDate <= this.startDate) {
    const error = new Error('End date must be after start date');
    return next(error);
  }
  next();
});

// Payment Schema
const PaymentSchema: Schema = new Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Please add a booking']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount must be positive']
  },
  currency: {
    type: String,
    required: [true, 'Please add a currency'],
    default: 'AED'
  },
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer'],
    required: [true, 'Please add a payment method']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  refundAmount: Number,
  refundReason: String,
  receiptUrl: String,
  paymentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Review Schema
const ReviewSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user']
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Please add a car']
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Please add a booking']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true
  },
  photos: [String],
  likes: {
    type: Number,
    default: 0
  },
  approved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update car rating when review is added or modified
ReviewSchema.post<IReview>('save', async function() {
  const Review = this.constructor as Model<IReview>;
  
  // Calculate average rating
  const stats = await Review.aggregate([
    { $match: { car: this.car, approved: true } },
    { 
      $group: { 
        _id: '$car', 
        avgRating: { $avg: '$rating' } 
      } 
    }
  ]);
  
  // Update car rating
  if (stats.length > 0) {
    const Car = mongoose.model<ICar>('Car');
    await Car.findByIdAndUpdate(this.car, {
      rating: stats[0].avgRating
    });
  }
});

// Create models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Car = mongoose.model<ICar>('Car', CarSchema);
export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export const Review = mongoose.model<IReview>('Review', ReviewSchema);

// Export all models
export default {
  User,
  Car,
  Booking,
  Payment,
  Review
};
