"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("orders", "amount_paid");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("orders", "amount_paid", {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    });
  },
};
