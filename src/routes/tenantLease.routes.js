// server/src/routes/tenantLease.routes.js
const express = require('express');
const router = express.Router();
const tenantLeaseController = require('../controllers/tenantLease.controller');
const { authenticate, authorize } = require('../middleware/auth');

// Update a tenant lease (only active, not ended)
router.put('/:id', authenticate, authorize('admin', 'manager'), tenantLeaseController.updateTenantLease);

// Delete a tenant lease (only active, not ended)
router.delete('/:id', authenticate, authorize('admin', 'manager'), tenantLeaseController.deleteTenantLease);

module.exports = router;
