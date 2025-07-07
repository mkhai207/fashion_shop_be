const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const db = require("../../models");
const Product = db.Product;
const Size = db.Size;
const Color = db.Color;

const createProductVariantValidator = validate(
  checkSchema({
    product_id: {
      notEmpty: {
        errorMessage: "Product ID is required",
      },
      isString: {
        errorMessage: "Product ID must be a string",
      },
      isLength: {
        options: { max: 255 },
        errorMessage: "Product ID must not exceed 255 characters",
      },
      custom: {
        options: async (value) => {
          const product = await Product.findByPk(value);
          if (!product) {
            throw new Error("Product ID does not exist");
          }
          return true;
        },
      },
    },
    size_id: {
      notEmpty: {
        errorMessage: "Size ID is required",
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Size ID must be a positive integer",
      },
      custom: {
        options: async (value) => {
          const size = await Size.findByPk(value);
          if (!size) {
            throw new Error("Size ID does not exist");
          }
          return true;
        },
      },
    },
    color_id: {
      notEmpty: {
        errorMessage: "Color ID is required",
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Color ID must be a positive integer",
      },
      custom: {
        options: async (value) => {
          const color = await Color.findByPk(value);
          if (!color) {
            throw new Error("Color ID does not exist");
          }
          return true;
        },
      },
    },
    quantity: {
      notEmpty: {
        errorMessage: "Quantity is required",
      },
      isInt: {
        options: { min: 0 },
        errorMessage: "Quantity must be a non-negative integer",
      },
    },
  })
);

const updateProductVariantValidator = validate(
  checkSchema({
    product_id: {
      optional: true,
      notEmpty: {
        errorMessage: "Product ID is required",
      },
      isString: {
        errorMessage: "Product ID must be a string",
      },
      isLength: {
        options: { max: 255 },
        errorMessage: "Product ID must not exceed 255 characters",
      },
      custom: {
        options: async (value) => {
          const product = await Product.findByPk(value);
          if (!product) {
            throw new Error("Product ID does not exist");
          }
          return true;
        },
      },
    },
    size_id: {
      optional: true,
      notEmpty: {
        errorMessage: "Size ID is required",
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Size ID must be a positive integer",
      },
      custom: {
        options: async (value) => {
          const size = await Size.findByPk(value);
          if (!size) {
            throw new Error("Size ID does not exist");
          }
          return true;
        },
      },
    },
    color_id: {
      optional: true,
      notEmpty: {
        errorMessage: "Color ID is required",
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Color ID must be a positive integer",
      },
      custom: {
        options: async (value) => {
          const color = await Color.findByPk(value);
          if (!color) {
            throw new Error("Color ID does not exist");
          }
          return true;
        },
      },
    },
    quantity: {
      optional: true,
      isInt: {
        options: { min: 0 },
        errorMessage: "Quantity must be a non-negative integer",
      },
    },
    active: {
      optional: true,
      isBoolean: {
        errorMessage: "active must be a boolean",
      },
    },
  })
);

module.exports = {
  createProductVariantValidator,
  updateProductVariantValidator,
};
