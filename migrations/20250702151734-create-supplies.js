"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("supplies", {
      supplier_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: "suppliers", key: "id" },
      },
      product_id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        references: { model: "products", key: "id" },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("supplies");
  },
};
