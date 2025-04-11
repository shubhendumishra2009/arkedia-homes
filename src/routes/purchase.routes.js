const express = require('express');
const router = express.Router();
const { 
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase
} = require('../controllers/purchase.controller');
const { authenticate, authorize } = require('../middleware/auth');

// Get all purchases - Admin only
router.get('/', authenticate, authorize(['admin']), getAllPurchases);

// Get purchase by ID - Admin only
router.get('/:id', authenticate, authorize(['admin']), getPurchaseById);

// Create new purchase - Admin only
router.post('/', authenticate, authorize(['admin']), createPurchase);

// Update purchase - Admin only
router.put('/:id', authenticate, authorize(['admin']), updatePurchase);

// Delete purchase - Admin only
router.delete('/:id', authenticate, authorize(['admin']), deletePurchase);

module.exports = router;