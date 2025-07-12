const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all users
router.get('/', userController.getAllUsers);

// Get available employees for user assignment
router.get('/employees', userController.getAvailableEmployees);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create new user
router.post('/', userController.createUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

// Get user permissions
router.get('/:id/permissions', userController.getUserPermissions);

// Update user permissions
router.post('/:id/permissions', userController.updateUserPermissions);

module.exports = router;