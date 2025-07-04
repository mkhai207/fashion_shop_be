const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define(
    "Discount",
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
      code: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      valid_until: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "discounts",
      timestamps: false,
    }
  );

  Discount.associate = (models) => {
    Discount.hasMany(models.Order, { foreignKey: "discount_id", as: "orders" });
  };
  return Discount;
};
