// server/src/routes/bookingTenant.routes.js
const express = require('express');
const router = express.Router();
const { bookTenant } = require('../controllers/bookingTenant.controller');

// POST /api/book-tenant
router.post('/book-tenant', bookTenant);

module.exports = router;
