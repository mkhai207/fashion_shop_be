const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
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
      active: {
        type: DataTypes.BOOLEAN,
      },
      avatar: {
        type: DataTypes.STRING(255),
      },
      birthday: {
        type: DataTypes.DATE,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
      },
      full_name: {
        type: DataTypes.STRING(255),
      },
      gender: {
        type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(255),
      },
      refresh_token: {
        type: DataTypes.TEXT,
      },
      role_id: {
        type: DataTypes.BIGINT,
        references: { model: "Roles", key: "id" },
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "role_id", as: "role" });
    User.hasMany(models.Address, { foreignKey: "user_id", as: "addresses" });
    User.hasMany(models.Cart, { foreignKey: "user_id", as: "carts" });
    User.hasMany(models.Order, { foreignKey: "user_id", as: "orders" });
    User.hasMany(models.Review, { foreignKey: "user_id", as: "reviews" });
  };

  return User;
};
