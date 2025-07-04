const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
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
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("MALE", "FEMALE", "UNISEX"),
        allowNull: false,
      },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
      thumbnail: {
        type: DataTypes.STRING(255),
      },
      slider: {
        type: DataTypes.TEXT,
      },
      category_id: {
        type: DataTypes.BIGINT,
        references: { model: "Categories", key: "id" },
      },
      brand_id: {
        type: DataTypes.BIGINT,
        references: { model: "Brands", key: "id" },
      },
    },
    {
      tableName: "products",
      timestamps: false,
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
    Product.belongsTo(models.Brand, { foreignKey: "brand_id", as: "brand" });
    Product.hasMany(models.ProductVariant, {
      foreignKey: "product_id",
      as: "variants",
    });
    Product.hasMany(models.Review, { foreignKey: "product_id", as: "reviews" });
    Product.belongsToMany(models.Supplier, {
      through: models.Supplies,
      foreignKey: "product_id",
      as: "suppliers",
    });
  };

  return Product;
};
