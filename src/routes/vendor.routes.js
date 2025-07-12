const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const { authenticate, authorize } = require('../middleware/auth');

// Get all vendors
router.get('/', authenticate, authorize(['admin']), vendorController.getAllVendors);

// Get vendor by ID
router.get('/:id', authenticate, authorize(['admin']), vendorController.getVendorById);

// Create a new vendor
router.post('/', authenticate, authorize(['admin']), vendorController.createVendor);

// Update a vendor
router.put('/:id', authenticate, authorize(['admin']), vendorController.updateVendor);

// Delete a vendor
router.delete('/:id', authenticate, authorize(['admin']), vendorController.deleteVendor);

module.exports = router;