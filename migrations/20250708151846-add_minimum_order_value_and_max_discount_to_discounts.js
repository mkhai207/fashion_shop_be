"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("discounts", "minimum_order_value", {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
      comment: "Minimum order value to apply the discount",
    });

    await queryInterface.addColumn("discounts", "max_discount_amount", {
      type: Sequelize.DOUBLE,
      allowNull: true,
      comment: "Maximum discount amount that can be applied",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("discounts", "minimum_order_value");
    await queryInterface.removeColumn("discounts", "max_discount_amount");
  },
};
