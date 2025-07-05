const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define(
    "Size",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "sizes",
      timestamps: false,
    }
  );

  Size.associate = (models) => {
    Size.hasMany(models.ProductVariant, {
      foreignKey: "size_id",
      as: "productVariants",
    });
  };

  return Size;
};
