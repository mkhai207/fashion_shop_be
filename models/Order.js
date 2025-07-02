const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
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
    name: {
      type: DataTypes.STRING(255),
    },
    payment_method: {
      type: DataTypes.ENUM("CASH", "ONLINE"),
    },
    phone: {
      type: DataTypes.STRING(255),
    },
    shipping_address: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.ENUM(
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
      type: DataTypes.DOUBLE,
    },
    amount_paid: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    discount_id: {
      type: DataTypes.BIGINT,
      references: { model: "Discounts", key: "id" },
    },
    user_id: {
      type: DataTypes.BIGINT,
      references: { model: "Users", key: "id" },
    },
    address_id: {
      type: DataTypes.BIGINT,
      references: { model: "Addresses", key: "id" },
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

Order.associate = (models) => {
  Order.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  Order.belongsTo(models.Address, { foreignKey: "address_id", as: "address" });
  Order.belongsTo(models.Discount, {
    foreignKey: "discount_id",
    as: "discount",
  });
  Order.hasMany(models.OrderDetail, {
    foreignKey: "order_id",
    as: "orderDetails",
  });
};

module.exports = Order;
