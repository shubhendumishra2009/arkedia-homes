'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // define associations here
      Booking.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      Booking.belongsTo(models.Room, {
        foreignKey: 'room_id',
        as: 'room'
      });
      
      Booking.hasMany(models.BookingPayment, {
        foreignKey: 'booking_id',
        as: 'payments'
      });
    }
  }
  
  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id'
      }
    },
    booking_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    check_in_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_out_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    duration_type: {
      type: DataTypes.ENUM('short_term', 'medium_term', 'long_term', 'with_fooding'),
      allowNull: false
    },
    room_category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    room_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    special_requests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    identity_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    identity_number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    payment_status: {
      type: DataTypes.ENUM('unpaid', 'partial', 'paid'),
      allowNull: false,
      defaultValue: 'unpaid'
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
    modelName: 'Booking',
    tableName: 'bookings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Booking;
};