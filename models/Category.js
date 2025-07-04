const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
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
        type: DataTypes.STRING(255),
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "categories",
      timestamps: false,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: "category_id",
      as: "products",
    });
  };
  return Category;
};
