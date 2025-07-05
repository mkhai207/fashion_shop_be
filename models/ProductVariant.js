const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define(
    "ProductVariant",
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
      product_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: { model: "Products", key: "id" },
      },
      size_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: "Sizes", key: "id" },
      },
      color_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: "Colors", key: "id" },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "product_variants",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["product_id", "size_id", "color_id"],
          name: "uniq_product_variant",
        },
      ],
    }
  );

  ProductVariant.associate = (models) => {
    ProductVariant.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
    ProductVariant.belongsTo(models.Size, {
      foreignKey: "size_id",
      as: "size",
    });
    ProductVariant.belongsTo(models.Color, {
      foreignKey: "color_id",
      as: "color",
    });
    ProductVariant.hasMany(models.Cart, {
      foreignKey: "product_variant_id",
      as: "carts",
    });
    ProductVariant.hasMany(models.OrderDetail, {
      foreignKey: "product_variant_id",
      as: "orderDetails",
    });
  };

  return ProductVariant;
};
