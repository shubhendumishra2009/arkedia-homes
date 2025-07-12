require('dotenv').config();
console.log('DEBUG: DB_USERNAME =', process.env.DB_USERNAME);
console.log('DEBUG: DB_PASSWORD =', process.env.DB_PASSWORD ? '[HIDDEN]' : undefined);
console.log('DEBUG: DB_NAME =', process.env.DB_NAME);
console.log('DEBUG: DB_HOST =', process.env.DB_HOST);

// Configuration for different environments
module.exports = {
  // Local development configuration
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'rootroot',
    database: process.env.DB_NAME || 'arkedia_homes',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00',
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_TEST_NAME || 'arkedia_homes_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00',
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  },
  production: {
    username: process.env.DB_USERNAME  || 'u953841782_arkediahomes',
    password: process.env.DB_PASSWORD || '@123DevMahapatra',
    database: process.env.DB_NAME || 'u953841782_arkedia_homes',
    host: process.env.DB_HOST || 'srv1924.hstgr.io',
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00',
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};