'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    static associate(models) {
      // define associations here
      Vendor.hasMany(models.Purchase, {
        foreignKey: 'vendor_id',
        as: 'purchases'
      });
    }
  }
  
  Vendor.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contact_person: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    service_type: {
      type: DataTypes.ENUM('maintenance', 'supplies', 'electronics', 'furniture', 'cleaning', 'food', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    payment_terms: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bank_account_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blacklisted'),
      allowNull: false,
      defaultValue: 'active'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Vendor',
    tableName: 'vendors',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Vendor;
};