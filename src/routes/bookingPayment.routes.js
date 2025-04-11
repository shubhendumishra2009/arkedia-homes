const express = require('express');
const { 
  getAllBookingPayments, 
  getBookingPaymentById, 
  createBookingPayment, 
  getPaymentsByBookingId, 
  updateBookingPayment 
} = require('../controllers/bookingPayment.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all booking payments - Admin only
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllBookingPayments);

// Get booking payment by ID
router.get('/:id', authMiddleware, getBookingPaymentById);

// Create new booking payment
router.post('/', authMiddleware, createBookingPayment);

// Update booking payment
router.put('/:id', authMiddleware, updateBookingPayment);

// Get payments by booking ID
router.get('/booking/:bookingId', authMiddleware, getPaymentsByBookingId);

module.exports = router;