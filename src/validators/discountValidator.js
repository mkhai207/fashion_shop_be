const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const db = require("../../models");
const Discount = db.Discount;

const createDiscountValidator = validate(
  checkSchema({
    code: {
      in: ["body"],
      notEmpty: { errorMessage: "Discount code is required" },
      isString: { errorMessage: "Discount code must be a string" },
      isLength: {
        options: { min: 3, max: 50 },
        errorMessage: "Discount code must be between 3 and 50 characters",
      },
      custom: {
        options: async (value) => {
          const discount = await Discount.findOne({ where: { code: value } });
          if (discount) {
            throw new Error("Discount code already exists");
          }
          return true;
        },
      },
    },
    name: {
      in: ["body"],
      notEmpty: { errorMessage: "Name is required" },
      isString: {
        errorMessage: "Name must be a string",
      },
    },
    description: {
      in: ["body"],
      notEmpty: { errorMessage: "Description is required" },
      isString: {
        errorMessage: "Description must be a string",
      },
    },
    discount_value: {
      in: ["body"],
      notEmpty: { errorMessage: "Discount value is required" },
      isFloat: {
        options: { min: 1 },
        errorMessage: "Discount value must be a positive number",
      },
      custom: {
        options: (value, { req }) => {
          if (req.body.discount_type === "PERCENTAGE" && value > 100) {
            throw new Error("Discount value for PERCENTAGE cannot exceed 100");
          }
          return true;
        },
      },
    },
    discount_type: {
      in: ["body"],
      notEmpty: { errorMessage: "Discount type is required" },
      isIn: {
        options: [["FIXED", "PERCENTAGE"]],
        errorMessage: "Discount type must be FIXED or PERCENTAGE",
      },
    },
    valid_from: {
      in: ["body"],
      isISO8601: { errorMessage: "Valid from must be a valid ISO date" },
      notEmpty: { errorMessage: "Valid from is required" },
    },
    valid_until: {
      in: ["body"],
      isISO8601: { errorMessage: "Valid until must be a valid ISO date" },
      notEmpty: { errorMessage: "Valid until is required" },
      custom: {
        options: (value, { req }) => {
          const validFrom = new Date(req.body.valid_from);
          const validUntil = new Date(value);
          if (validUntil <= validFrom) {
            throw new Error("Valid until must be after valid from");
          }
          if (validUntil <= new Date()) {
            throw new Error("Valid until must be in the future");
          }
          return true;
        },
      },
    },
    minimum_order_value: {
      in: ["body"],
      isFloat: {
        options: { min: 0 },
        errorMessage: "Minimum order value must be a non-negative number",
      },
      notEmpty: { errorMessage: "Minimum order value is required" },
    },
    max_discount_amount: {
      in: ["body"],
      optional: true,
      isFloat: {
        options: { min: 0 },
        errorMessage: "Max discount amount must be a non-negative number",
      },
    },
  })
);

const getDiscountValidator = validate(
  checkSchema({
    code: {
      in: ["params"],
      notEmpty: { errorMessage: "Discount code is required" },
      isString: { errorMessage: "Discount code must be a string" },
      custom: {
        options: async (value) => {
          const discount = await Discount.findOne({ where: { code: value } });
          if (!discount) {
            throw new Error("Discount code not found");
          }
          if (discount.valid_until < new Date()) {
            throw new Error("Discount code has expired");
          }
          return true;
        },
      },
    },
  })
);

const updateDiscountValidator = validate(
  checkSchema({
    code: {
      in: ["body"],
      optional: true,
      notEmpty: { errorMessage: "Discount code is required" },
      isString: { errorMessage: "Discount code must be a string" },
      isLength: {
        options: { min: 3, max: 50 },
        errorMessage: "Discount code must be between 3 and 50 characters",
      },
      custom: {
        options: async (value) => {
          const discount = await Discount.findOne({ where: { code: value } });
          if (discount) {
            throw new Error("Discount code already exists");
          }
          return true;
        },
      },
    },
    name: {
      in: ["body"],
      optional: true,
      notEmpty: { errorMessage: "Name is required" },
      isString: {
        errorMessage: "Name must be a string",
      },
    },
    description: {
      in: ["body"],
      optional: true,
      notEmpty: { errorMessage: "Description is required" },
      isString: {
        errorMessage: "Description must be a string",
      },
    },
    discount_value: {
      in: ["body"],
      optional: true,
      notEmpty: { errorMessage: "Discount value is required" },
      isFloat: {
        options: { min: 1 },
        errorMessage: "Discount value must be a positive number",
      },
      custom: {
        options: (value, { req }) => {
          if (req.body.discount_type === "PERCENTAGE" && value > 100) {
            throw new Error("Discount value for PERCENTAGE cannot exceed 100");
          }
          return true;
        },
      },
    },
    discount_type: {
      in: ["body"],
      optional: true,
      notEmpty: { errorMessage: "Discount type is required" },
      isIn: {
        options: [["FIXED", "PERCENTAGE"]],
        errorMessage: "Discount type must be FIXED or PERCENTAGE",
      },
    },
    valid_from: {
      in: ["body"],
      optional: true,
      isISO8601: { errorMessage: "Valid from must be a valid ISO date" },
      notEmpty: { errorMessage: "Valid from is required" },
    },
    valid_until: {
      in: ["body"],
      optional: true,
      isISO8601: { errorMessage: "Valid until must be a valid ISO date" },
      notEmpty: { errorMessage: "Valid until is required" },
      custom: {
        options: (value, { req }) => {
          const validFrom = new Date(req.body.valid_from);
          const validUntil = new Date(value);
          if (validUntil <= validFrom) {
            throw new Error("Valid until must be after valid from");
          }
          if (validUntil <= new Date()) {
            throw new Error("Valid until must be in the future");
          }
          return true;
        },
      },
    },
    minimum_order_value: {
      in: ["body"],
      optional: true,
      isFloat: {
        options: { min: 0 },
        errorMessage: "Minimum order value must be a non-negative number",
      },
      notEmpty: { errorMessage: "Minimum order value is required" },
    },
    max_discount_amount: {
      in: ["body"],
      optional: true,
      isFloat: {
        options: { min: 0 },
        errorMessage: "Max discount amount must be a non-negative number",
      },
    },
  })
);

module.exports = {
  createDiscountValidator,
  getDiscountValidator,
  updateDiscountValidator,
};
