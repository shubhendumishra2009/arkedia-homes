'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BookingPayment extends Model {
    static associate(models) {
      // define associations here
      BookingPayment.belongsTo(models.Booking, {
        foreignKey: 'booking_id',
        as: 'booking'
      });
    }
  }
  
  BookingPayment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
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
      defaultValue: 'online'
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
    modelName: 'BookingPayment',
    tableName: 'booking_payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return BookingPayment;
};