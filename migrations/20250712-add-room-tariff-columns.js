'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rooms', 'short_term_price', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'medium_term_price', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'long_term_price', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });

    // With Fooding (all meals)
    await queryInterface.addColumn('rooms', 'short_term_price_with_fooding', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'medium_term_price_with_fooding', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'long_term_price_with_fooding', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });

    // Meal plan combinations
    await queryInterface.addColumn('rooms', 'breakfast_only_short_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'breakfast_only_medium_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'breakfast_only_long_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });

    await queryInterface.addColumn('rooms', 'lunch_only_short_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'lunch_only_medium_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'lunch_only_long_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });

    await queryInterface.addColumn('rooms', 'dinner_only_short_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'dinner_only_medium_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'dinner_only_long_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });

    await queryInterface.addColumn('rooms', 'bf_and_dinner_short_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'bf_and_dinner_medium_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'bf_and_dinner_long_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });

    await queryInterface.addColumn('rooms', 'lunch_and_dinner_short_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'lunch_and_dinner_medium_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
    await queryInterface.addColumn('rooms', 'lunch_and_dinner_long_term', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });

    // Remove old column if it exists
    try {
      await queryInterface.removeColumn('rooms', 'with_fooding_price');
    } catch (err) {
      // Ignore if column does not exist
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all new columns
    await queryInterface.removeColumn('rooms', 'short_term_price');
    await queryInterface.removeColumn('rooms', 'medium_term_price');
    await queryInterface.removeColumn('rooms', 'long_term_price');

    await queryInterface.removeColumn('rooms', 'short_term_price_with_fooding');
    await queryInterface.removeColumn('rooms', 'medium_term_price_with_fooding');
    await queryInterface.removeColumn('rooms', 'long_term_price_with_fooding');

    await queryInterface.removeColumn('rooms', 'breakfast_only_short_term');
    await queryInterface.removeColumn('rooms', 'breakfast_only_medium_term');
    await queryInterface.removeColumn('rooms', 'breakfast_only_long_term');

    await queryInterface.removeColumn('rooms', 'lunch_only_short_term');
    await queryInterface.removeColumn('rooms', 'lunch_only_medium_term');
    await queryInterface.removeColumn('rooms', 'lunch_only_long_term');

    await queryInterface.removeColumn('rooms', 'dinner_only_short_term');
    await queryInterface.removeColumn('rooms', 'dinner_only_medium_term');
    await queryInterface.removeColumn('rooms', 'dinner_only_long_term');

    await queryInterface.removeColumn('rooms', 'bf_and_dinner_short_term');
    await queryInterface.removeColumn('rooms', 'bf_and_dinner_medium_term');
    await queryInterface.removeColumn('rooms', 'bf_and_dinner_long_term');

    await queryInterface.removeColumn('rooms', 'lunch_and_dinner_short_term');
    await queryInterface.removeColumn('rooms', 'lunch_and_dinner_medium_term');
    await queryInterface.removeColumn('rooms', 'lunch_and_dinner_long_term');

    // Restore old column
    await queryInterface.addColumn('rooms', 'with_fooding_price', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
    });
  }
};
