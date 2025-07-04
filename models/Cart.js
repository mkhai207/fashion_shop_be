const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      created_by: {
        type: DataTypes.STRING(255),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_by: {
        type: DataTypes.STRING(255),
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_variant_id: {
        type: DataTypes.BIGINT,
        references: { model: "ProductVariants", key: "id" },
      },
      user_id: {
        type: DataTypes.BIGINT,
        references: { model: "Users", key: "id" },
      },
    },
    {
      tableName: "carts",
      timestamps: false,
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Cart.belongsTo(models.ProductVariant, {
      foreignKey: "product_variant_id",
      as: "variant",
    });
  };
  return Cart;
};
