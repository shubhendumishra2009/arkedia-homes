'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RentPayment extends Model {
    static associate(models) {
      // define associations here
      RentPayment.belongsTo(models.Tenant, {
        foreignKey: 'tenant_id',
        as: 'tenant'
      });
    }
  }
  
  RentPayment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tenants',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'credit_card', 'debit_card', 'check', 'online', 'other'),
      allowNull: false,
      defaultValue: 'cash'
    },
    payment_for_month: {
      type: DataTypes.DATE,
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    receipt_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'completed'
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
    modelName: 'RentPayment',
    tableName: 'rent_payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return RentPayment;
};