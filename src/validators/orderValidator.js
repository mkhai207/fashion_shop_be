const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const db = require("../../models");
const Order = db.Order;
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
          if (Number(req.user.role) !== 1 || Number(req.user.role) !== 2)
            throw new Error("Only admin or staff can specify user");
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
          if (Number(req.user.role) !== 1 || Number(req.user.role) !== 2) {
            throw new Error("Only admin or staff can specify status");
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

const updateOrderStatusValidator = validate(
  checkSchema({
    id: {
      in: ["params"],
      isInt: {
        options: { min: 1 },
        errorMessage: "Order ID must be a positive integer",
      },
      custom: {
        options: async (value, { req }) => {
          const order = await Order.findByPk(value);
          if (!order) {
            throw new Error(`Order with ID ${value} not found`);
          }
          if (Number(req.user.role) === 3 && order.user_id !== req.user.id) {
            throw new Error("Unauthorized to update this order");
          }
          return true;
        },
      },
    },
    status: {
      in: ["body"],
      notEmpty: { errorMessage: "Status is required" },
      isIn: {
        options: [["UNPAID", "PAID", "SHIPPING", "DELIVERED", "CANCELED"]],
        errorMessage:
          "Status must be one of: UNPAID, PAID, SHIPPING, DELIVERED, CANCELED",
      },
      custom: {
        options: async (value, { req }) => {
          if (Number(req.user.role) === 3 && value !== "CANCELED") {
            throw new Error("Customer can only set status to CANCELED");
          }
          if (Number(req.user.role) === 2 && value === "PAID") {
            throw new Error("Staff cannot set status to PAID");
          }
          const order = await Order.findByPk(req.params.id);
          if (Number(req.user.role) === 3 && order.status !== "UNPAID") {
            throw new Error("Customer can only cancel UNPAID orders");
          }
          return true;
        },
      },
    },
  })
);

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
};
