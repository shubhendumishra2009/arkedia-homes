'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    static associate(models) {
      // define associations here
      Complaint.belongsTo(models.Tenant, {
        foreignKey: 'tenant_id',
        as: 'tenant'
      });
    }
  }
  
  Complaint.init({
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
    subject: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('maintenance', 'electrical', 'plumbing', 'security', 'cleanliness', 'noise', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'closed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resolved_at: {
      type: DataTypes.DATE,
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
    modelName: 'Complaint',
    tableName: 'complaints',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Complaint;
};