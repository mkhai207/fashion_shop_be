"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("permission_role", {
      role_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: "roles", key: "id" },
      },
      permission_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: "permissions", key: "id" },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("permission_role");
  },
};
