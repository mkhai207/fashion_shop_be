"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("orders", "address_id");
    await queryInterface.changeColumn("orders", "name", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn("orders", "phone", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn("orders", "shipping_address", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("orders", "address_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: "addresses", key: "id" },
    });
    await queryInterface.changeColumn("orders", "name", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn("orders", "phone", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn("orders", "shipping_address", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
};
