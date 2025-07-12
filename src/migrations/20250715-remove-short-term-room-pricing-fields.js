'use strict';

// Migration to remove all short-term pricing fields from the rooms table
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('rooms', 'short_term_price');
    await queryInterface.removeColumn('rooms', 'short_term_price_with_fooding');
    await queryInterface.removeColumn('rooms', 'breakfast_only_short_term');
    await queryInterface.removeColumn('rooms', 'lunch_only_short_term');
    await queryInterface.removeColumn('rooms', 'dinner_only_short_term');
    await queryInterface.removeColumn('rooms', 'bf_and_dinner_short_term');
    await queryInterface.removeColumn('rooms', 'lunch_and_dinner_short_term');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rooms', 'short_term_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('rooms', 'short_term_price_with_fooding', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('rooms', 'breakfast_only_short_term', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('rooms', 'lunch_only_short_term', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('rooms', 'dinner_only_short_term', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('rooms', 'bf_and_dinner_short_term', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('rooms', 'lunch_and_dinner_short_term', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  }
};
