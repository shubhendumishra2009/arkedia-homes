const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', tenantController.getAllTenants);
router.get('/:id', tenantController.getTenantById);

// Protected routes (admin only)
router.post('/', authenticate, authorize(['admin']), tenantController.createTenant);
router.put('/:id', authenticate, authorize(['admin']), tenantController.updateTenant);
router.delete('/:id', authenticate, authorize(['admin']), tenantController.deleteTenant);

module.exports = router;