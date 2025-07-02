"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "product_variants",
      {
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
        product_id: {
          type: Sequelize.STRING(255),
          references: { model: "products", key: "id" },
        },
        size: {
          type: Sequelize.ENUM("S", "M", "L", "XL", "XXL"),
          allowNull: false,
        },
        color: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        indexes: [
          {
            unique: true,
            fields: ["product_id", "size", "color"],
            name: "uniq_product_variant",
          },
        ],
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("product_variants");
  },
};
