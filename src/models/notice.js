'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notice extends Model {
    static associate(models) {
      // define associations here
      Notice.belongsTo(models.Tenant, {
        foreignKey: 'tenant_id',
        as: 'tenant'
      });
    }
  }
  
  Notice.init({
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
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('general', 'maintenance', 'payment', 'termination', 'other'),
      allowNull: false,
      defaultValue: 'general'
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'cancelled'),
      allowNull: false,
      defaultValue: 'active'
    },
    effective_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expiry_date: {
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
    modelName: 'Notice',
    tableName: 'notices',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Notice;
};