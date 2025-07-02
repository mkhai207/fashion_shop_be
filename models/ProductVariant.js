const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
      references: { model: "Products", key: "id" },
    },
    size: {
      type: DataTypes.ENUM("S", "M", "L", "XL", "XXL"),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
        fields: ["product_id", "size", "color"],
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
  ProductVariant.hasMany(models.Cart, {
    foreignKey: "product_variant_id",
    as: "carts",
  });
  ProductVariant.hasMany(models.OrderDetail, {
    foreignKey: "product_variant_id",
    as: "orderDetails",
  });
};

module.exports = ProductVariant;
