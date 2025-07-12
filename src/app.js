const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { errorHandler } = require('./middleware/errorHandler');


const corsOptions = {
  origin: [
    'https://arkediahomes.com', // Your production domain
    'https://www.arkediahomes.com', // Optional: with www
    'http://localhost:3000' // For local development
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
// Import routes
const authRoutes = require('./routes/auth.routes');
const roomRoutes = require('./routes/room.routes');
const tenantRoutes = require('./routes/tenant.routes');
const tenantLeaseRoutes = require('./routes/tenantLease.routes');
const employeeRoutes = require('./routes/employees.routes');
const vendorRoutes = require('./routes/vendor.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const userRoutes = require('./routes/users.routes');
const permissionRoutes = require('./routes/permissionRoutes');
const propertyRoutes = require('./routes/property.routes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/tenant-leases', tenantLeaseRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/meal-tariff-master', require('./routes/mealTariffMaster.routes'));


// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;