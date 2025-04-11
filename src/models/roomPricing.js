'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoomPricing extends Model {
    static associate(models) {
      // No direct associations needed
    }
  }
  
  RoomPricing.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_category: {
      type: DataTypes.ENUM('CLASSIC', 'DELUXE NON-AC', 'DELUXE AC'),
      allowNull: false
    },
    room_type: {
      type: DataTypes.ENUM('SINGLE', 'DOUBLE'),
      allowNull: false
    },
    duration_type: {
      type: DataTypes.ENUM('short_term', 'medium_term', 'long_term', 'with_fooding'),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    description: {
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
    modelName: 'RoomPricing',
    tableName: 'room_pricing',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['room_category', 'room_type', 'duration_type']
      }
    ]
  });
  
  return RoomPricing;
};