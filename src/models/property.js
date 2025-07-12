'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    static associate(models) {
      // define associations here
      Property.hasMany(models.Room, {
        foreignKey: 'property_id',
        as: 'rooms'
      });
      
      // Add relationship with TenantLease
      Property.hasMany(models.TenantLease, {
        foreignKey: 'property_id',
        as: 'leases'
      });
      
      // Add many-to-many relationship with employees
      Property.belongsToMany(models.Employee, {
        through: models.EmployeeProperty,
        foreignKey: 'property_id',
        otherKey: 'employee_id',
        as: 'employees'
      });
    }
  }
  
  Property.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    property_type: {
      type: DataTypes.ENUM('apartment', 'villa', 'hostel', 'pg', 'other'),
      allowNull: false,
      defaultValue: 'apartment'
    },
    total_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    amenities: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('amenities');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('amenities', JSON.stringify(value));
      }
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
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'under_maintenance'),
      allowNull: false,
      defaultValue: 'active'
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
    modelName: 'Property',
    tableName: 'properties',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Property;
};