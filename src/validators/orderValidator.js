const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const db = require("../../models");
const Cart = db.Cart;
const ProductVariant = db.ProductVariant;
const Discount = db.Discount;
const User = db.User;

const createOrderValidator = validate(
  checkSchema({
    user: {
      optional: true,
      custom: {
        options: async (value, { req }) => {
          if (!value || !value.id) return true;
          if (Number(req.user.role) !== 1)
            throw new Error("Only admin can specify user");
          const user = await User.findByPk(value.id);
          if (!user) throw new Error("User not found");
          return true;
        },
      },
    },
    orderDetails: {
      isArray: { errorMessage: "orderDetails must be an array" },
      custom: {
        options: async (value) => {
          if (!value || !Array.isArray(value) || !value.length) {
            throw new Error("orderDetails must be a non-empty array");
          }
          for (const item of value) {
            if (!item.product_variant_id || !item.quantity) {
              throw new Error(
                "Each item must have product_variant_id and quantity"
              );
            }
            const variant = await ProductVariant.findByPk(
              item.product_variant_id
            );
            if (!variant)
              throw new Error(
                `Product variant ${item.product_variant_id} not found`
              );
            if (
              !Number.isInteger(Number(item.quantity)) ||
              Number(item.quantity) <= 0
            ) {
              throw new Error(
                `Invalid quantity for product variant ${item.product_variant_id}`
              );
            }
            if (item.quantity > variant.quantity) {
              throw new Error(
                `Insufficient stock for product variant ${item.product_variant_id}`
              );
            }
          }
          return true;
        },
      },
    },
    name: {
      notEmpty: { errorMessage: "Recipient name is required" },
      isString: { errorMessage: "Recipient name must be a string" },
    },
    phone: {
      notEmpty: { errorMessage: "Phone number is required" },
      isString: { errorMessage: "Invalid phone number" },
    },
    shipping_address: {
      notEmpty: { errorMessage: "Shipping address is required" },
      isString: { errorMessage: "Shipping address must be a string" },
    },
    discount_code: {
      optional: true,
      isString: { errorMessage: "Discount code must be a string" },
      custom: {
        options: async (value) => {
          if (!value) return true;
          const discount = await Discount.findOne({ where: { code: value } });
          if (!discount || discount.valid_until < new Date()) {
            throw new Error("Invalid or expired discount code");
          }
          return true;
        },
      },
    },
    paymentMethod: {
      isIn: {
        options: [["CASH", "ONLINE"]],
        errorMessage: "Invalid payment method",
      },
    },
    status: {
      optional: true,
      custom: {
        options: async (value, { req }) => {
          if (!value || value === "") return true;
          if (Number(req.user.role) !== 1) {
            throw new Error("Only admin can specify status");
          }
          if (
            ![
              "PENDING",
              "UNPAID",
              "PAID",
              "SHIPPING",
              "COMPLETED",
              "CANCELED",
            ].includes(value)
          ) {
            throw new Error("Invalid status");
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
  createOrderValidator,
};
