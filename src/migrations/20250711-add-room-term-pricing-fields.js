// Migration to add short_term_price, medium_term_price, long_term_price to rooms table
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rooms', 'short_term_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('rooms', 'medium_term_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
    await queryInterface.addColumn('rooms', 'long_term_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('rooms', 'short_term_price');
    await queryInterface.removeColumn('rooms', 'medium_term_price');
    await queryInterface.removeColumn('rooms', 'long_term_price');
  }
};
