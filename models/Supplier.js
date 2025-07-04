const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    "Supplier",
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
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
      },
      phone: {
        type: DataTypes.STRING(255),
      },
      address: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: "suppliers",
      timestamps: false,
    }
  );

  Supplier.associate = (models) => {
    Supplier.belongsToMany(models.Product, {
      through: models.Supplies,
      foreignKey: "supplier_id",
      as: "products",
    });
  };
  return Supplier;
};
