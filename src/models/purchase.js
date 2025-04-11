'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {
      // define associations here
      // No direct associations for now
    }
  }
  
  Purchase.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    item_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    vendor: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    category: {
      type: DataTypes.ENUM('groceries', 'maintenance', 'utilities', 'furniture', 'electronics', 'cleaning', 'office', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'credit_card', 'debit_card', 'check', 'online', 'other'),
      allowNull: false,
      defaultValue: 'cash'
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('required', 'pending', 'ordered', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'completed'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium'
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
    modelName: 'Purchase',
    tableName: 'purchases',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Purchase;
};