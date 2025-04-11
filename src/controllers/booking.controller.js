const { Booking, User, Room, BookingPayment } = require('../models');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Get all bookings
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'room_no', 'room_type', 'room_category', 'floor']
        },
        {
          model: BookingPayment,
          as: 'payments'
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'room_no', 'room_type', 'room_category', 'floor']
        },
        {
          model: BookingPayment,
          as: 'payments'
        }
      ]
    });
    
    if (!booking) {
      throw new ApiError(`Booking with ID ${id} not found`, 404);
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new booking
 */
const createBooking = async (req, res, next) => {
  try {
    const { 
      user_id,
      room_id,
      check_in_date,
      check_out_date,
      duration_type,
      room_category,
      room_type,
      price,
      special_requests,
      identity_type,
      identity_number
    } = req.body;
    
    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new ApiError(`User with ID ${user_id} not found`, 404);
    }
    
    // Check if room exists and is available
    const room = await Room.findByPk(room_id);
    if (!room) {
      throw new ApiError(`Room with ID ${room_id} not found`, 404);
    }
    
    if (room.status !== 'available' && room.status !== 'reserved') {
      throw new ApiError(`Room is not available for booking`, 400);
    }
    
    // Create new booking
    const booking = await Booking.create({
      user_id,
      room_id,
      check_in_date,
      check_out_date,
      duration_type,
      room_category,
      room_type,
      price,
      special_requests,
      identity_type,
      identity_number,
      status: 'pending',
      payment_status: 'unpaid'
    });
    
    // Update room status to reserved
    await room.update({ status: 'reserved' });
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a booking
 */
const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      check_in_date,
      check_out_date,
      duration_type,
      price,
      special_requests,
      status,
      payment_status
    } = req.body;
    
    // Find booking
    const booking = await Booking.findByPk(id);
    if (!booking) {
      throw new ApiError(`Booking with ID ${id} not found`, 404);
    }
    
    // Update booking
    await booking.update({
      check_in_date: check_in_date || booking.check_in_date,
      check_out_date: check_out_date || booking.check_out_date,
      duration_type: duration_type || booking.duration_type,
      price: price || booking.price,
      special_requests: special_requests || booking.special_requests,
      status: status || booking.status,
      payment_status: payment_status || booking.payment_status
    });
    
    // If booking status is cancelled, update room status to available
    if (status === 'cancelled') {
      const room = await Room.findByPk(booking.room_id);
      if (room) {
        await room.update({ status: 'available' });
      }
    }
    
    // If booking status is confirmed, update room status to occupied
    if (status === 'confirmed') {
      const room = await Room.findByPk(booking.room_id);
      if (room) {
        await room.update({ status: 'occupied' });
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a booking
 */
const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find booking
    const booking = await Booking.findByPk(id);
    if (!booking) {
      throw new ApiError(`Booking with ID ${id} not found`, 404);
    }
    
    // If booking is confirmed or pending, update room status to available
    if (booking.status === 'confirmed' || booking.status === 'pending') {
      const room = await Room.findByPk(booking.room_id);
      if (room) {
        await room.update({ status: 'available' });
      }
    }
    
    // Delete booking
    await booking.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get bookings by user ID
 */
const getBookingsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'room_no', 'room_type', 'room_category', 'floor']
        },
        {
          model: BookingPayment,
          as: 'payments'
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingsByUserId
};