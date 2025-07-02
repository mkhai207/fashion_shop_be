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

Supplies.associate = (models) => {
  Supplies.belongsTo(models.Supplier, {
    foreignKey: "supplier_id",
    as: "supplier",
  });
  Supplies.belongsTo(models.Product, {
    foreignKey: "product_id",
    as: "product",
  });
};

module.exports = Supplies;
