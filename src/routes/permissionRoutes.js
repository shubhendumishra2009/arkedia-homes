const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get user permissions for a specific page
router.get('/', permissionController.getUserPermissions);

// Get all forms/pages for a user
router.get('/forms', permissionController.getUserForms);

module.exports = router;