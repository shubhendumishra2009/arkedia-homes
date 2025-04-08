'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tenant extends Model {
    static associate(models) {
      // define associations here
      Tenant.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Tenant.hasMany(models.RentPayment, {
        foreignKey: 'tenant_id',
        as: 'rentPayments'
      });
      Tenant.hasMany(models.Complaint, {
        foreignKey: 'tenant_id',
        as: 'complaints'
      });
      Tenant.hasMany(models.Notice, {
        foreignKey: 'tenant_id',
        as: 'notices'
      });
      Tenant.hasMany(models.Feedback, {
        foreignKey: 'tenant_id',
        as: 'feedback'
      });
    }
  }
  
  Tenant.init({
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
    room_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms',
        key: 'id'
      }
    },
    join_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    rent_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    security_deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    lease_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lease_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    payment_due_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
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
    modelName: 'Tenant',
    tableName: 'tenants',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return Tenant;
};