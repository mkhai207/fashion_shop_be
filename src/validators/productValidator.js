const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const db = require("../../models");
const Product = db.Product;
const Category = db.Category;
const Brand = db.Brand;

const createProductValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Product name cannot be empty",
      },
      isString: {
        errorMessage: "Product name must be a string",
      },
      isLength: {
        options: { min: 3, max: 255 },
        errorMessage: "Product name must be between 3 and 255 characters",
      },
      trim: true,
    },
    description: {
      optional: true,
      isString: {
        errorMessage: "Description must be a string",
      },
      trim: true,
    },
    price: {
      notEmpty: {
        errorMessage: "Price cannot be empty",
      },
      isFloat: {
        options: { min: 0 },
        errorMessage: "Price must be a positive number",
      },
    },
    gender: {
      notEmpty: {
        errorMessage: "Gender cannot be empty",
      },
      isIn: {
        options: [["MALE", "FEMALE", "UNISEX"]],
        errorMessage: "Gender must be one of: MALE, FEMALE, UNISEX",
      },
    },
    sold: {
      optional: true,
      isInt: {
        options: { min: 0 },
        errorMessage: "Sold must be a non-negative integer",
      },
      default: 0,
    },
    status: {
      optional: true,
      isBoolean: {
        errorMessage: "Status must be a boolean",
      },
    },
    thumbnail: {
      optional: true,
      isString: {
        errorMessage: "Thumbnail must be a string",
      },
      isLength: {
        options: { max: 255 },
        errorMessage: "Thumbnail URL must not exceed 255 characters",
      },
      trim: true,
    },
    slider: {
      optional: true,
      isString: {
        errorMessage: "Slider must be a string",
      },
      trim: true,
    },
    category_id: {
      notEmpty: {
        errorMessage: "Category ID cannot be empty",
      },
      isInt: {
        errorMessage: "Category ID must be an integer",
      },
      custom: {
        options: async (value) => {
          const category = await Category.findByPk(value);
          if (!category) {
            throw new Error("Category ID does not exist");
          }
          return true;
        },
      },
    },
    brand_id: {
      optional: true,
      isInt: {
        errorMessage: "Brand ID must be an integer",
      },
      custom: {
        options: async (value) => {
          if (value) {
            const brand = await Brand.findByPk(value);
            if (!brand) {
              throw new Error("Brand ID does not exist");
            }
          }
          return true;
        },
      },
    },
  })
);

const updateProductValidator = validate(
  checkSchema({
    name: {
      optional: true,
      notEmpty: {
        errorMessage: "Product name cannot be empty",
      },
      isString: {
        errorMessage: "Product name must be a string",
      },
      isLength: {
        options: { min: 3, max: 255 },
        errorMessage: "Product name must be between 3 and 255 characters",
      },
      trim: true,
    },
    description: {
      optional: true,
      isString: {
        errorMessage: "Description must be a string",
      },
      trim: true,
    },
    price: {
      optional: true,
      notEmpty: {
        errorMessage: "Price cannot be empty",
      },
      isFloat: {
        optional: true,
        options: { min: 0 },
        errorMessage: "Price must be a positive number",
      },
    },
    gender: {
      optional: true,
      notEmpty: {
        errorMessage: "Gender cannot be empty",
      },
      isIn: {
        options: [["MALE", "FEMALE", "UNISEX"]],
        errorMessage: "Gender must be one of: MALE, FEMALE, UNISEX",
      },
    },
    sold: {
      optional: true,
      isInt: {
        options: { min: 0 },
        errorMessage: "Sold must be a non-negative integer",
      },
      default: 0,
    },
    status: {
      optional: true,
      isBoolean: {
        errorMessage: "Status must be a boolean",
      },
    },
    thumbnail: {
      optional: true,
      isString: {
        errorMessage: "Thumbnail must be a string",
      },
      isLength: {
        options: { max: 255 },
        errorMessage: "Thumbnail URL must not exceed 255 characters",
      },
      trim: true,
    },
    slider: {
      optional: true,
      isString: {
        errorMessage: "Slider must be a string",
      },
      trim: true,
    },
    category_id: {
      optional: true,
      notEmpty: {
        errorMessage: "Category ID cannot be empty",
      },
      isInt: {
        errorMessage: "Category ID must be an integer",
      },
      custom: {
        options: async (value) => {
          const category = await Category.findByPk(value);
          if (!category) {
            throw new Error("Category ID does not exist");
          }
          return true;
        },
      },
    },
    brand_id: {
      optional: true,
      isInt: {
        errorMessage: "Brand ID must be an integer",
      },
      custom: {
        options: async (value) => {
          if (value) {
            const brand = await Brand.findByPk(value);
            if (!brand) {
              throw new Error("Brand ID does not exist");
            }
          }
          return true;
        },
      },
    },
  })
);

module.exports = {
  createProductValidator,
  updateProductValidator,
};
