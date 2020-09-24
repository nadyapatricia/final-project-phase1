'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('UserProducts', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'custom_fkey_UserId',
      references: { //Required field
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    .then(() => {
      return queryInterface.addConstraint('UserProducts', {
        fields: ['ProductId'],
        type: 'foreign key',
        name: 'custom_fkey_ProductId',
        references: { //Required field
          table: 'Products',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('UserProducts', 'custom_fkey_UserId')
      .then(() => {
        return queryInterface.removeConstraint('UserProducts', 'custom_fkey_ProductId')
    })
  }
};
