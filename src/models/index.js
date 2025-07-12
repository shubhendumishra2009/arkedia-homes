'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

// ✅ Confirm loaded DB values (from config)
console.log('ENV:', env, 'Loaded config:', config);
console.log('From process.env directly:');
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

const db = {};

let sequelize;
try {
  if (config && config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else if (config) {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  } else {
    throw new Error('Sequelize config is undefined for env: ' + env);
  }
} catch (e) {
  console.error('Error initializing Sequelize:', e);
}

// Load models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    console.log('Attempting to require model file:', path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Register MealTariffMaster explicitly if not loaded by filename
try {
  if (!db.MealTariffMaster) {
    db.MealTariffMaster = require('./mealTariffMaster')(sequelize, Sequelize.DataTypes);
  }
} catch (e) {
  console.error('Error loading MealTariffMaster:', e);
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
