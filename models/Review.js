const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
      },
      user_id: {
        type: DataTypes.BIGINT,
        references: { model: "Users", key: "id" },
      },
      product_id: {
        type: DataTypes.STRING(255),
        references: { model: "Products", key: "id" },
      },
    },
    {
      tableName: "reviews",
      timestamps: false,
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Review.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return Review;
};
