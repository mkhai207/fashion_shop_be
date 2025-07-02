const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
    product_id: {
      type: DataTypes.STRING(255),
      references: { model: "Products", key: "id" },
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
  Cart.belongsTo(models.User, { foreignKey: "user_id" });
  Cart.belongsTo(models.Product, { foreignKey: "product_id" });
};

module.exports = Cart;
