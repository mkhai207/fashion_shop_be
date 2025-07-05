const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define(
    "Color",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      hex_code: {
        type: DataTypes.STRING(7),
        allowNull: true,
      },
    },
    {
      tableName: "colors",
      timestamps: false,
    }
  );

  Color.associate = (models) => {
    Color.hasMany(models.ProductVariant, {
      foreignKey: "color_id",
      as: "productVariants",
    });
  };

  return Color;
};
