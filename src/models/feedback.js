'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      // define associations here
      Feedback.belongsTo(models.Tenant, {
        foreignKey: 'tenant_id',
        as: 'tenant'
      });
    }
  }
  
  Feedback.init({
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    category: {
      type: DataTypes.ENUM('service', 'maintenance', 'cleanliness', 'security', 'amenities', 'staff', 'other'),
      allowNull: false,
      defaultValue: 'service'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_anonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'addressed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    admin_response: {
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
    modelName: 'Feedback',
    tableName: 'feedback',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Feedback;
};