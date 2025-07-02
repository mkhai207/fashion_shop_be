"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("orders", {
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
      name: {
        type: Sequelize.STRING(255),
      },
      payment_method: {
        type: Sequelize.ENUM("CASH", "ONLINE"),
      },
      phone: {
        type: Sequelize.STRING(255),
      },
      shipping_address: {
        type: Sequelize.STRING(255),
      },
      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "UNPAID",
          "PAID",
          "SHIPPING",
          "COMPLETED",
          "CANCELED"
        ),
        defaultValue: "PENDING",
      },
      total_money: {
        type: Sequelize.DOUBLE,
      },
      amount_paid: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      discount_id: {
        type: Sequelize.BIGINT,
        references: { model: "discounts", key: "id" },
      },
      user_id: {
        type: Sequelize.BIGINT,
        references: { model: "users", key: "id" },
      },
      address_id: {
        type: Sequelize.BIGINT,
        references: { model: "addresses", key: "id" },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("orders");
  },
};
