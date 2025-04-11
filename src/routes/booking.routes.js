const express = require('express');
const { 
  getAllBookings, 
  getBookingById, 
  createBooking, 
  updateBooking, 
  deleteBooking, 
  getBookingsByUserId 
} = require('../controllers/booking.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all bookings - Admin only
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllBookings);

// Get booking by ID
router.get('/:id', authMiddleware, getBookingById);

// Create new booking
router.post('/', authMiddleware, createBooking);

// Update booking
router.put('/:id', authMiddleware, updateBooking);

// Delete booking
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteBooking);

// Get bookings by user ID
router.get('/user/:userId', authMiddleware, getBookingsByUserId);

module.exports = router;