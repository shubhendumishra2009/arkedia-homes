// models/tenantLease.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TenantLease extends Model {
    static associate(models) {
      TenantLease.belongsTo(models.Tenant, { foreignKey: 'tenant_id', as: 'tenant' });
      TenantLease.belongsTo(models.Room, { foreignKey: 'room_id', as: 'room' });
      TenantLease.belongsTo(models.Property, { foreignKey: 'property_id', as: 'property' });
    }
  }
  TenantLease.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tenants', key: 'id' }
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'rooms', key: 'id' }
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'properties', key: 'id' }
    },
    lease_start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lease_end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    rent_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    security_deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    payment_due_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM('active', 'terminated', 'pending'),
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
    modelName: 'TenantLease',
    tableName: 'tenant_leases',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return TenantLease;
};
