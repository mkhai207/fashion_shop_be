const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
  User.hasMany(models.Address, { foreignKey: "user_id" });
  User.hasMany(models.Cart, { foreignKey: "user_id" });
  User.hasMany(models.Order, { foreignKey: "user_id" });
  User.hasMany(models.Review, { foreignKey: "user_id" });
  User.belongsTo(models.Role, { foreignKey: "role_id" });
};

module.exports = User;
