import nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Email options interface
interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  attachments?: any[];
}

// Configure email transporter based on environment
const createTransporter = () => {
  // For production, use configured SMTP server
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  } 
  // For development, use ethereal.email (fake SMTP service)
  else {
    // Create a test account if not already created
    return new Promise<nodemailer.Transporter<SentMessageInfo>>(async (resolve, reject) => {
      try {
        // Generate test SMTP service account from ethereal.email
        const testAccount = await nodemailer.createTestAccount();
        
        // Create a transporter using the test account
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        
        resolve(transporter);
      } catch (error) {
        console.error('Failed to create test email account:', error);
        reject(error);
      }
    });
  }
};

/**
 * Send an email
 * @param options Email options (recipient, subject, message)
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = await createTransporter();
    
    // Email message configuration
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Dubai Luxury Cars'} <${process.env.FROM_EMAIL || 'noreply@dubailuxurycars.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
      attachments: options.attachments || []
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    // Log URL for development environment (ethereal.email)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    console.log(`Email sent to ${options.email}: ${info.messageId}`);
  } catch (error) {
    console.error('Email could not be sent:', error);
    throw new Error('Email could not be sent');
  }
};

/**
 * Send a verification email
 * @param email Recipient email
 * @param name Recipient name
 * @param verificationToken Verification token
 */
export const sendVerificationEmail = async (email: string, name: string, verificationToken: string): Promise<void> => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #B8860B;">Dubai Luxury Car Rentals</h1>
      </div>
      <h2 style="color: #333;">Email Verification</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering with Dubai Luxury Car Rentals. To complete your registration and access our exclusive collection of luxury vehicles, please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #B8860B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
      </div>
      <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This verification link will expire in 24 hours.</p>
      <p>If you did not create an account, please disregard this email.</p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Dubai Luxury Car Rentals. All rights reserved.</p>
        <p>Sheikh Zayed Road, Dubai, UAE</p>
      </div>
    </div>
  `;
  
  await sendEmail({
    email,
    subject: 'Verify Your Email - Dubai Luxury Car Rentals',
    message
  });
};

/**
 * Send a password reset email
 * @param email Recipient email
 * @param name Recipient name
 * @param resetToken Password reset token
 */
export const sendPasswordResetEmail = async (email: string, name: string, resetToken: string): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #B8860B;">Dubai Luxury Car Rentals</h1>
      </div>
      <h2 style="color: #333;">Password Reset</h2>
      <p>Hello ${name},</p>
      <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
      <p>Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #B8860B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This password reset link will expire in 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Dubai Luxury Car Rentals. All rights reserved.</p>
        <p>Sheikh Zayed Road, Dubai, UAE</p>
      </div>
    </div>
  `;
  
  await sendEmail({
    email,
    subject: 'Password Reset - Dubai Luxury Car Rentals',
    message
  });
};

/**
 * Send a booking confirmation email
 * @param email Recipient email
 * @param name Recipient name
 * @param bookingDetails Booking details object
 */
export const sendBookingConfirmationEmail = async (
  email: string, 
  name: string, 
  bookingDetails: {
    bookingId: string;
    carName: string;
    startDate: string;
    endDate: string;
    pickupLocation: string;
    dropoffLocation: string;
    totalPrice: number;
    imageUrl?: string;
  }
): Promise<void> => {
  const bookingUrl = `${process.env.CLIENT_URL}/dashboard/bookings/${bookingDetails.bookingId}`;
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #B8860B;">Dubai Luxury Car Rentals</h1>
      </div>
      <h2 style="color: #333;">Booking Confirmation</h2>
      <p>Hello ${name},</p>
      <p>Thank you for your booking with Dubai Luxury Car Rentals. Your reservation has been confirmed!</p>
      
      <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h3 style="color: #B8860B; margin-top: 0;">Booking Details</h3>
        <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
        <p><strong>Vehicle:</strong> ${bookingDetails.carName}</p>
        <p><strong>Rental Period:</strong> ${bookingDetails.startDate} to ${bookingDetails.endDate}</p>
        <p><strong>Pickup Location:</strong> ${bookingDetails.pickupLocation}</p>
        <p><strong>Dropoff Location:</strong> ${bookingDetails.dropoffLocation}</p>
        <p><strong>Total Price:</strong> AED ${bookingDetails.totalPrice.toLocaleString()}</p>
      </div>
      
      ${bookingDetails.imageUrl ? `
        <div style="text-align: center; margin: 20px 0;">
          <img src="${bookingDetails.imageUrl}" alt="${bookingDetails.carName}" style="max-width: 100%; border-radius: 5px; max-height: 200px; object-fit: cover;">
        </div>
      ` : ''}
      
      <p>You can view your booking details and manage your reservation by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${bookingUrl}" style="background-color: #B8860B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Booking</a>
      </div>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our customer service team at ${process.env.SUPPORT_EMAIL || 'support@dubailuxurycars.com'} or call us at ${process.env.SUPPORT_PHONE || '+971 4 123 4567'}.</p>
      
      <p>We look forward to providing you with an exceptional luxury driving experience!</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Dubai Luxury Car Rentals. All rights reserved.</p>
        <p>Sheikh Zayed Road, Dubai, UAE</p>
      </div>
    </div>
  `;
  
  await sendEmail({
    email,
    subject: 'Booking Confirmation - Dubai Luxury Car Rentals',
    message
  });
};

/**
 * Send a booking status update email
 * @param email Recipient email
 * @param name Recipient name
 * @param bookingId Booking ID
 * @param status New booking status
 * @param carName Car name
 */
export const sendBookingStatusEmail = async (
  email: string, 
  name: string, 
  bookingId: string, 
  status: string,
  carName: string
): Promise<void> => {
  const bookingUrl = `${process.env.CLIENT_URL}/dashboard/bookings/${bookingId}`;
  
  let statusMessage = '';
  let subject = '';
  
  switch (status) {
    case 'confirmed':
      subject = 'Booking Confirmed';
      statusMessage = 'Your booking has been confirmed! Your luxury vehicle is reserved and will be ready for you on your selected date.';
      break;
    case 'active':
      subject = 'Booking Active';
      statusMessage = 'Your booking is now active. Enjoy your luxury driving experience!';
      break;
    case 'completed':
      subject = 'Booking Completed';
      statusMessage = 'Your booking has been completed. We hope you enjoyed your experience with Dubai Luxury Car Rentals.';
      break;
    case 'cancelled':
      subject = 'Booking Cancelled';
      statusMessage = 'Your booking has been cancelled. If you have any questions, please contact our customer service team.';
      break;
    default:
      subject = 'Booking Update';
      statusMessage = `Your booking status has been updated to: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  }
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #B8860B;">Dubai Luxury Car Rentals</h1>
      </div>
      <h2 style="color: #333;">Booking Update</h2>
      <p>Hello ${name},</p>
      <p>${statusMessage}</p>
      
      <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h3 style="color: #B8860B; margin-top: 0;">Booking Information</h3>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Vehicle:</strong> ${carName}</p>
        <p><strong>Status:</strong> <span style="color: ${
          status === 'confirmed' ? '#28a745' : 
          status === 'active' ? '#007bff' : 
          status === 'completed' ? '#6c757d' : 
          status === 'cancelled' ? '#dc3545' : '#17a2b8'
        }; font-weight: bold;">${status.charAt(0).toUpperCase() + status.slice(1)}</span></p>
      </div>
      
      <p>You can view your booking details by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${bookingUrl}" style="background-color: #B8860B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Booking</a>
      </div>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our customer service team at ${process.env.SUPPORT_EMAIL || 'support@dubailuxurycars.com'} or call us at ${process.env.SUPPORT_PHONE || '+971 4 123 4567'}.</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Dubai Luxury Car Rentals. All rights reserved.</p>
        <p>Sheikh Zayed Road, Dubai, UAE</p>
      </div>
    </div>
  `;
  
  await sendEmail({
    email,
    subject: `${subject} - Dubai Luxury Car Rentals`,
    message
  });
};

/**
 * Send a payment confirmation email
 * @param email Recipient email
 * @param name Recipient name
 * @param paymentDetails Payment details object
 */
export const sendPaymentConfirmationEmail = async (
  email: string, 
  name: string, 
  paymentDetails: {
    bookingId: string;
    carName: string;
    amount: number;
    paymentDate: string;
    transactionId: string;
    receiptUrl?: string;
  }
): Promise<void> => {
  const bookingUrl = `${process.env.CLIENT_URL}/dashboard/bookings/${paymentDetails.bookingId}`;
  
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #B8860B;">Dubai Luxury Car Rentals</h1>
      </div>
      <h2 style="color: #333;">Payment Confirmation</h2>
      <p>Hello ${name},</p>
      <p>Thank you for your payment. We have received your payment for your luxury car rental.</p>
      
      <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0;">
        <h3 style="color: #B8860B; margin-top: 0;">Payment Details</h3>
        <p><strong>Booking ID:</strong> ${paymentDetails.bookingId}</p>
        <p><strong>Vehicle:</strong> ${paymentDetails.carName}</p>
        <p><strong>Amount Paid:</strong> AED ${paymentDetails.amount.toLocaleString()}</p>
        <p><strong>Payment Date:</strong> ${paymentDetails.paymentDate}</p>
        <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
      </div>
      
      ${paymentDetails.receiptUrl ? `
        <p>You can view or download your receipt by clicking <a href="${paymentDetails.receiptUrl}" style="color: #B8860B; font-weight: bold;">here</a>.</p>
      ` : ''}
      
      <p>You can view your booking details by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${bookingUrl}" style="background-color: #B8860B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Booking</a>
      </div>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our customer service team at ${process.env.SUPPORT_EMAIL || 'support@dubailuxurycars.com'} or call us at ${process.env.SUPPORT_PHONE || '+971 4 123 4567'}.</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Dubai Luxury Car Rentals. All rights reserved.</p>
        <p>Sheikh Zayed Road, Dubai, UAE</p>
      </div>
    </div>
  `;
  
  await sendEmail({
    email,
    subject: 'Payment Confirmation - Dubai Luxury Car Rentals',
    message
  });
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
  sendBookingStatusEmail,
  sendPaymentConfirmationEmail
};
