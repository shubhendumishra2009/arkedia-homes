'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      // define associations here

      // Add relationship with TenantLease
      Room.hasMany(models.TenantLease, {
        foreignKey: 'room_id',
        as: 'leases'
      });
      Room.belongsTo(models.Property, {
        foreignKey: 'property_id',
        as: 'property'
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
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    room_type: {
      type: DataTypes.ENUM('single', 'double', 'deluxe', 'suite'),
      allowNull: false,
      defaultValue: 'single'
    },
    room_category: {
      type: DataTypes.ENUM('classic', 'deluxe non-ac', 'deluxe ac'),
      allowNull: false,
      defaultValue: 'classic'
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
    short_term_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    medium_term_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    long_term_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    short_term_price_with_fooding: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    medium_term_price_with_fooding: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    long_term_price_with_fooding: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    breakfast_only_short_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    breakfast_only_medium_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    breakfast_only_long_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    lunch_only_short_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    lunch_only_medium_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    lunch_only_long_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    dinner_only_short_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    dinner_only_medium_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    dinner_only_long_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    bf_and_dinner_short_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    bf_and_dinner_medium_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    bf_and_dinner_long_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    lunch_and_dinner_short_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    lunch_and_dinner_medium_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    lunch_and_dinner_long_term: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
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
    has_tv: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_internet: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_private_bathroom: {
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
    // Virtual field for pricing that doesn't exist in database table
    // but is used in application logic
    pricing: {
      type: DataTypes.VIRTUAL,
      get() {
        // Return default pricing structure
        return {
          shortTerm: this.base_rent * 1.2, // 20% premium for short term
          mediumTerm: this.base_rent * 1.1, // 10% premium for medium term
          longTerm: this.base_rent,         // Base rate for long term
          withFooding: this.base_rent * 1.3  // 30% premium with fooding
        };
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