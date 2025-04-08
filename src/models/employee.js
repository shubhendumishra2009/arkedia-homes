'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      // define associations here
      Employee.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Employee.hasMany(models.Complaint, {
        foreignKey: 'assigned_to',
        as: 'assignedComplaints'
      });
    }
  }
  
  Employee.init({
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
    department: {
      type: DataTypes.ENUM('maintenance', 'housekeeping', 'security', 'management', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    hire_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
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
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_leave'),
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
    modelName: 'Employee',
    tableName: 'employees',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Employee;
};