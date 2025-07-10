"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm trường name
    await queryInterface.addColumn("discounts", "name", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    // Thêm trường description
    await queryInterface.addColumn("discounts", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa trường description
    await queryInterface.removeColumn("discounts", "description");

    // Xóa trường name
    await queryInterface.removeColumn("discounts", "name");
  },
};
