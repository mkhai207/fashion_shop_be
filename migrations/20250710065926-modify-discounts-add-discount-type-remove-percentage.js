"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm trường discount_type
    await queryInterface.addColumn("discounts", "discount_type", {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "FIXED",
      validate: {
        isIn: [["FIXED", "PERCENTAGE"]],
      },
    });

    // Xóa trường percentage
    await queryInterface.removeColumn("discounts", "percentage");
  },

  async down(queryInterface, Sequelize) {
    // Khôi phục trường percentage
    await queryInterface.addColumn("discounts", "percentage", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    // Xóa trường discount_type
    await queryInterface.removeColumn("discounts", "discount_type");
  },
};
