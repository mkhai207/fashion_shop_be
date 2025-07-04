const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
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

  PermissionRole.associate = (models) => {
    PermissionRole.belongsTo(models.Role, {
      foreignKey: "role_id",
      as: "role",
    });
    PermissionRole.belongsTo(models.Permission, {
      foreignKey: "permission_id",
      as: "permission",
    });
  };
  return PermissionRole;
};
