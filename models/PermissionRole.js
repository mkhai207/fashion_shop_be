const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PermissionRole = sequelize.define(
  "PermissionRole",
  {
    role_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: { model: "Roles", key: "id" },
    },
    permission_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: { model: "Permissions", key: "id" },
    },
  },
  {
    tableName: "permission_role",
    timestamps: false,
  }
);

module.exports = PermissionRole;
