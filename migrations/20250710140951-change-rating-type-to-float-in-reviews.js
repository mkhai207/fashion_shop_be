"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("reviews", "rating", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("reviews", "rating", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
