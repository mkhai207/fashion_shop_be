"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "reviews",
      "unique_order_id_in_reviews"
    );

    await queryInterface.addConstraint("reviews", {
      fields: ["order_id", "product_id"],
      type: "unique",
      name: "reviews_order_product_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the new unique constraint
    await queryInterface.removeConstraint(
      "reviews",
      "unique_order_id_in_reviews"
    );

    // Add back the old unique constraint on order_id
    await queryInterface.addConstraint("reviews", {
      fields: ["order_id"],
      type: "unique",
      name: "reviews_order_id_unique",
    });
  },
};
