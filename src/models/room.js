'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      // define associations here
      Room.hasOne(models.Tenant, {
        foreignKey: 'room_id',
        as: 'tenant'
      });
    }
  }
  
  Room.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    room_type: {
      type: DataTypes.ENUM('single', 'double', 'deluxe', 'suite'),
      allowNull: false,
      defaultValue: 'single'
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area_sqft: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    base_rent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    is_furnished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_ac: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_balcony: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'reserved'),
      allowNull: false,
      defaultValue: 'available'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_urls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('image_urls');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('image_urls', JSON.stringify(value));
      }
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
    modelName: 'Room',
    tableName: 'rooms',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Room;
};