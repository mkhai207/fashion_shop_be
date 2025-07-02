"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("carts", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      created_by: {
        type: Sequelize.STRING(255),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_by: {
        type: Sequelize.STRING(255),
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_variant_id: {
        type: Sequelize.BIGINT,
        references: { model: "product_variants", key: "id" },
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: { model: "users", key: "id" },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("carts");
  },
};
