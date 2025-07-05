"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Bước 1: Thêm cột size_id và color_id
    await queryInterface.addColumn("product_variants", "size_id", {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "sizes", key: "id" },
    });

    await queryInterface.addColumn("product_variants", "color_id", {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: "colors", key: "id" },
    });

    // Bước 2: Xóa chỉ mục duy nhất cũ
    await queryInterface.removeIndex(
      "product_variants",
      "uniq_product_variant"
    );

    // Bước 3: Tạo chỉ mục duy nhất mới trên (product_id, size_id, color_id)
    await queryInterface.addIndex(
      "product_variants",
      ["product_id", "size_id", "color_id"],
      {
        unique: true,
        name: "uniq_product_variant",
      }
    );

    // Bước 4: Xóa cột size và color
    await queryInterface.removeColumn("product_variants", "size");
    await queryInterface.removeColumn("product_variants", "color");
  },

  async down(queryInterface, Sequelize) {
    // Bước 1: Thêm lại cột size và color
    await queryInterface.addColumn("product_variants", "size", {
      type: Sequelize.ENUM("S", "M", "L", "XL", "XXL"),
      allowNull: false,
    });

    await queryInterface.addColumn("product_variants", "color", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    // Bước 2: Xóa chỉ mục duy nhất mới
    await queryInterface.removeIndex(
      "product_variants",
      "uniq_product_variant"
    );

    // Bước 3: Tạo lại chỉ mục duy nhất cũ
    await queryInterface.addIndex(
      "product_variants",
      ["product_id", "size", "color"],
      {
        unique: true,
        name: "uniq_product_variant",
      }
    );

    // Bước 4: Xóa cột size_id và color_id
    await queryInterface.removeColumn("product_variants", "size_id");
    await queryInterface.removeColumn("product_variants", "color_id");
  },
};
