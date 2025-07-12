// Migration: Create tenants and tenant_leases tables
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tenants', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      join_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      payment_due_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'pending'),
        allowNull: false,
        defaultValue: 'active'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.createTable('tenant_leases', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tenant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tenants', key: 'id' },
        onDelete: 'CASCADE'
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rooms', key: 'id' },
        onDelete: 'CASCADE'
      },
      property_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'properties', key: 'id' },
        onDelete: 'CASCADE'
      },
      lease_start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      lease_end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      rent_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      security_deposit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      payment_due_day: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: Sequelize.ENUM('active', 'terminated', 'pending'),
        allowNull: false,
        defaultValue: 'active'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tenant_leases');
    await queryInterface.dropTable('tenants');
  }
};
