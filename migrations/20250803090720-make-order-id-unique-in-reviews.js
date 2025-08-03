"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("reviews", {
      fields: ["order_id"],
      type: "unique",
      name: "unique_order_id_in_reviews",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "reviews",
      "unique_order_id_in_reviews"
    );
  },
};
