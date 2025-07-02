const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderDetail = sequelize.define(
  "OrderDetail",
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
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.BIGINT,
      references: { model: "Orders", key: "id" },
    },
    product_id: {
      type: DataTypes.STRING(255),
      references: { model: "Products", key: "id" },
    },
  },
  {
    tableName: "order_detail",
    timestamps: false,
  }
);

OrderDetail.associate = (models) => {
  OrderDetail.belongsTo(models.Order, { foreignKey: "order_id" });
  OrderDetail.belongsTo(models.Product, { foreignKey: "product_id" });
};

module.exports = OrderDetail;
