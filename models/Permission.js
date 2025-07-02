const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Permission = sequelize.define(
  "Permission",
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
    api_path: {
      type: DataTypes.STRING(255),
    },
    method: {
      type: DataTypes.STRING(255),
    },
    module: {
      type: DataTypes.STRING(255),
    },
    name: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "permissions",
    timestamps: false,
  }
);

Permission.associate = (models) => {
  Permission.belongsToMany(models.Role, {
    through: models.PermissionRole,
    foreignKey: "permission_id",
  });
};

module.exports = Permission;
