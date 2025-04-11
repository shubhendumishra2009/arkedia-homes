const { BookingPayment, Booking } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all booking payments
 */
const getAllBookingPayments = async (req, res, next) => {
  try {
    const payments = await BookingPayment.findAll({
      include: [
        {
          model: Booking,
          as: 'booking',
          required: true
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking payment by ID
 */
const getBookingPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const payment = await BookingPayment.findByPk(id, {
      include: [
        {
          model: Booking,
          as: 'booking',
          required: true
        }
      ]
    });
    
    if (!payment) {
      throw new ApiError(`Payment with ID ${id} not found`, 404);
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new booking payment
 */
const createBookingPayment = async (req, res, next) => {
  try {
    const { 
      booking_id,
      amount,
      payment_method,
      transaction_id,
      receipt_no,
      status,
      notes
    } = req.body;
    
    // Check if booking exists
    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      throw new ApiError(`Booking with ID ${booking_id} not found`, 404);
    }
    
    // Create new payment
    const payment = await BookingPayment.create({
      booking_id,
      amount,
      payment_method,
      transaction_id,
      receipt_no,
      status: status || 'completed',
      notes
    });
    
    // Update booking payment status
    const totalPaid = await BookingPayment.sum('amount', {
      where: { 
        booking_id,
        status: 'completed'
      }
    });
    
    let paymentStatus = 'unpaid';
    if (totalPaid >= booking.price) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    }
    
    await booking.update({ payment_status: paymentStatus });
    
    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get payments by booking ID
 */
const getPaymentsByBookingId = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    
    // Check if booking exists
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new ApiError(`Booking with ID ${bookingId} not found`, 404);
    }
    
    const payments = await BookingPayment.findAll({
      where: { booking_id: bookingId }
    });
    
    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a booking payment
 */
const updateBookingPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      amount,
      payment_method,
      transaction_id,
      receipt_no,
      status,
      notes
    } = req.body;
    
    // Find payment
    const payment = await BookingPayment.findByPk(id);
    if (!payment) {
      throw new ApiError(`Payment with ID ${id} not found`, 404);
    }
    
    // Update payment
    await payment.update({
      amount: amount || payment.amount,
      payment_method: payment_method || payment.payment_method,
      transaction_id: transaction_id || payment.transaction_id,
      receipt_no: receipt_no || payment.receipt_no,
      status: status || payment.status,
      notes: notes || payment.notes
    });
    
    // Update booking payment status
    const booking = await Booking.findByPk(payment.booking_id);
    if (booking) {
      const totalPaid = await BookingPayment.sum('amount', {
        where: { 
          booking_id: payment.booking_id,
          status: 'completed'
        }
      });
      
      let paymentStatus = 'unpaid';
      if (totalPaid >= booking.price) {
        paymentStatus = 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partial';
      }
      
      await booking.update({ payment_status: paymentStatus });
    }
    
    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookingPayments,
  getBookingPaymentById,
  createBookingPayment,
  getPaymentsByBookingId,
  updateBookingPayment
};