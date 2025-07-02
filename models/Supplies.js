const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Supplies = sequelize.define(
  "Supplies",
  {
    supplier_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: { model: "Suppliers", key: "id" },
    },
    product_id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      references: { model: "Products", key: "id" },
    },
  },
  {
    tableName: "supplies",
    timestamps: false,
  }
);

module.exports = Supplies;
