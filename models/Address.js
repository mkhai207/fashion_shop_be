const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
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
      city: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      district: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
      },
      phone_number: {
        type: DataTypes.STRING(255),
      },
      recipient_name: {
        type: DataTypes.STRING(255),
      },
      street: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ward: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        references: { model: "Users", key: "id" },
      },
    },
    {
      tableName: "addresses",
      timestamps: false,
    }
  );

  Address.associate = (models) => {
    Address.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Address.hasMany(models.Order, { foreignKey: "address_id", as: "orders" });
  };

  return Address;
};
