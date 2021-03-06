'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Products', 'category', Sequelize.STRING, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Products', 'category', {})
  }
};
