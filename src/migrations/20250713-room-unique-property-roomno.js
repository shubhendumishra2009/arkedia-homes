'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the unique constraint from room_no if it exists
    // (this is safe even if it doesn't exist)
    await queryInterface.removeConstraint('rooms', 'rooms_room_no_key').catch(() => {});
    await queryInterface.removeIndex('rooms', ['room_no']).catch(() => {});

    // Add composite unique constraint on (property_id, room_no)
    await queryInterface.addConstraint('rooms', {
      fields: ['property_id', 'room_no'],
      type: 'unique',
      name: 'unique_property_room_no'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the composite unique constraint
    await queryInterface.removeConstraint('rooms', 'unique_property_room_no');
    // Add unique constraint back to room_no
    await queryInterface.addConstraint('rooms', {
      fields: ['room_no'],
      type: 'unique',
      name: 'rooms_room_no_key'
    });
  }
};
