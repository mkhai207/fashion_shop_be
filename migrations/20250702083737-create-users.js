"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
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
      active: {
        type: Sequelize.BOOLEAN,
      },
      avatar: {
        type: Sequelize.STRING(255),
      },
      birthday: {
        type: Sequelize.DATE,
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING(255),
      },
      gender: {
        type: Sequelize.ENUM("MALE", "FEMALE", "OTHER"),
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(255),
      },
      refresh_token: {
        type: Sequelize.TEXT,
      },
      role_id: {
        type: Sequelize.BIGINT,
        references: { model: "roles", key: "id" },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
