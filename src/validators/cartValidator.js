const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const db = require("../../models");
const ProductVariant = db.ProductVariant;
const Cart = db.Cart;

const addToCartValidator = validate(
  checkSchema({
    product_variant_id: {
      notEmpty: {
        errorMessage: "Product variant ID is required",
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Product variant ID must be a positive integer",
      },
      custom: {
        options: async (value) => {
          const variant = await ProductVariant.findByPk(value);
          if (!variant) {
            throw new Error("Product variant does not exist");
          }
          if (!variant.active) {
            throw new Error("Product variant is inactive");
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
        options: { min: 1 },
        errorMessage: "Quantity must be a positive integer",
      },
      custom: {
        options: async (value, { req }) => {
          const variant = await ProductVariant.findByPk(
            req.body.product_variant_id
          );
          if (variant && value > variant.quantity) {
            throw new Error(
              `Quantity exceeds available stock (${variant.quantity})`
            );
          }
          return true;
        },
      },
    },
  })
);

const updateCartValidator = validate(
  checkSchema({
    product_variant_id: {
      optional: true,
      notEmpty: {
        errorMessage: "Product variant ID is required",
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Product variant ID must be a positive integer",
      },
      custom: {
        options: async (value) => {
          const variant = await ProductVariant.findByPk(value);
          if (!variant) {
            throw new Error("Product variant does not exist");
          }
          if (!variant.active) {
            throw new Error("Product variant is inactive");
          }
          return true;
        },
      },
    },
    quantity: {
      optional: true,
      notEmpty: {
        errorMessage: "Quantity is required",
      },
      isInt: {
        options: { min: 1 },
        errorMessage: "Quantity must be a positive integer",
      },
      custom: {
        options: async (value, { req }) => {
          const variant = await ProductVariant.findByPk(
            req.body.product_variant_id
          );
          if (variant && value > variant.quantity) {
            throw new Error(
              `Quantity exceeds available stock (${variant.quantity})`
            );
          }
          return true;
        },
      },
    },
  })
);

const deleteMultipleCartItemsValidator = validate(
  checkSchema({
    cartIds: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Cart IDs are required",
      },
      isArray: {
        errorMessage: "Cart IDs must be an array",
      },
      custom: {
        options: async (value, { req }) => {
          if (!value.length) {
            throw new Error("Cart IDs array cannot be empty");
          }

          for (const id of value) {
            if (!Number.isInteger(id) || id < 1) {
              throw new Error(`Invalid cart ID: ${id}`);
            }
            const cartItem = await Cart.findByPk(id);
            if (!cartItem) {
              throw new Error(`Cart item with ID ${id} does not exist`);
            }
            if (cartItem.user_id !== req.user.id) {
              throw new Error(`Unauthorized to delete cart item with ID ${id}`);
            }
          }
          return true;
        },
      },
    },
  })
);

module.exports = {
  addToCartValidator,
  updateCartValidator,
  deleteMultipleCartItemsValidator,
};
