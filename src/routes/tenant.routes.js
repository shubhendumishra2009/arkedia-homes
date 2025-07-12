// server/src/routes/tenant.routes.js
const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
const { authenticate, authorize } = require('../middleware/auth');

// CRUD for tenants
router.get('/', authenticate, authorize('admin', 'manager'), tenantController.getAllTenants);
router.get('/:id', authenticate, authorize('admin', 'manager'), tenantController.getTenantById);
router.post('/', authenticate, authorize('admin', 'manager'), tenantController.createTenant);
router.put('/:id', authenticate, authorize('admin', 'manager'), tenantController.updateTenant);
router.delete('/:id', authenticate, authorize('admin', 'manager'), tenantController.deleteTenant);

// Bulk lease assignment
router.post('/assign-leases', authenticate, authorize('admin', 'manager'), tenantController.assignLeasesToTenant);

module.exports = router;
