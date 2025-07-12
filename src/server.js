console.log('DEBUG: server.js loaded');
const path = require('path');
// Load environment variables first
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// ✅ Print out key DB env variables
console.log('ENV FILE VALUES:');
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

// Start server
async function startServer() {
  try {
    // Test database connection
    console.log('✅ Attempting DB connection to:', process.env.DB_HOST, process.env.DB_NAME, process.env.DB_USERNAME);
    await sequelize.authenticate();
    console.log('✅ Connected to DB:', sequelize.config.database);
    console.log('✅ Database connected successfully to:', sequelize.config.database);
    
    // Sync database models (in development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      console.log('Database connection verified.');
    }
    
    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
