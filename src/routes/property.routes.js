const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes (admin only)
router.post('/', authenticate, propertyController.createProperty);
router.put('/:id', authenticate, propertyController.updateProperty);
router.delete('/:id', authenticate, propertyController.deleteProperty);

module.exports = router;