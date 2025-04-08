const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', roomController.getAllRooms);
router.get('/available', roomController.getAvailableRooms);
router.get('/:id', roomController.getRoomById);

// Protected routes (admin only)
router.post('/', authenticate, roomController.createRoom);
router.put('/:id', authenticate, roomController.updateRoom);
router.delete('/:id', authenticate, roomController.deleteRoom);

module.exports = router;