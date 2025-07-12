'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      // Define associations
      Employee.belongsToMany(models.Property, {
        through: models.EmployeeProperty,
        foreignKey: 'employee_id',
        otherKey: 'property_id',
        as: 'properties'
      });
      
      Employee.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Employee.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    department: {
      type: DataTypes.ENUM('maintenance','housekeeping','security','management','other'),
      defaultValue: 'other',
      allowNull: false
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    emergency_contact: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    emergency_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    is_app_user: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active','inactive','on_leave'),
      defaultValue: 'active',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    hire_date: {
      type: DataTypes.DATE,
      allowNull: false
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
    modelName: 'Employee',
    tableName: 'employees',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Employee;
};