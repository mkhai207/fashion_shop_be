const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const db = require("../../models");
const { Product, Order, OrderDetail, Review, ProductVariant } = db;

const createReviewValidator = validate(
  checkSchema({
    product_id: {
      in: ["body"],
      notEmpty: { errorMessage: "Product ID is required" },
      isString: { errorMessage: "Product ID must a string" },
      custom: {
        options: async (value) => {
          const product = await Product.findByPk(value);
          if (!product) {
            throw new Error("Product not found");
          }
          return true;
        },
      },
    },
    order_id: {
      in: ["body"],
      isInt: { errorMessage: "Order ID must be an integer" },
      custom: {
        options: async (value, { req }) => {
          if (!value) return true;
          const order = await Order.findOne({
            where: { id: value, user_id: req.user.id },
            include: [
              {
                model: OrderDetail,
                as: "orderDetails",
                include: [
                  {
                    model: ProductVariant,
                    as: "variant",
                    where: { product_id: req.body.product_id },
                  },
                ],
              },
            ],
          });
          if (!order || order.orderDetails.length === 0) {
            throw new Error("Order not found or product not purchased");
          }
          return true;
        },
      },
    },
    rating: {
      in: ["body"],
      notEmpty: { errorMessage: "Rating is required" },
      isFloat: {
        options: { min: 1, max: 5 },
        errorMessage: "Rating must be between 1 and 5",
      },
    },
    comment: {
      in: ["body"],
      optional: true,
      isString: { errorMessage: "Comment must be a string" },
      isLength: {
        options: { max: 500 },
        errorMessage: "Comment must be less than 500 characters",
      },
    },
    images: {
      in: ["body"],
      optional: true,
      isString: { errorMessage: "Images must be a string" },
      isLength: {
        options: { max: 1000 },
        errorMessage: "Images field must be less than 1000 characters",
      },
    },
    custom: {
      options: async (value, { req }) => {
        const existingReview = await Review.findOne({
          where: { user_id: req.user.id, product_id: req.body.product_id },
        });
        if (existingReview) {
          throw new Error("You have already reviewed this product");
        }
        return true;
      },
    },
  })
);

const getReviewsValidator = validate(
  checkSchema({
    productId: {
      in: ["params"],
      notEmpty: { errorMessage: "Product ID is required" },
      isInt: { errorMessage: "Product ID must be an integer" },
      custom: {
        options: async (value) => {
          const product = await Product.findByPk(value);
          if (!product) {
            throw new Error("Product not found");
          }
          return true;
        },
      },
    },
    page: {
      in: ["query"],
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: "Page must be a positive integer",
      },
      toInt: true,
    },
    limit: {
      in: ["query"],
      optional: true,
      isInt: {
        options: { min: 1, max: 100 },
        errorMessage: "Limit must be between 1 and 100",
      },
      toInt: true,
    },
  })
);

const getAverageRatingValidator = validate(
  checkSchema({
    productId: {
      in: ["params"],
      notEmpty: { errorMessage: "Product ID is required" },
      isString: { errorMessage: "Product ID must be a string" },
      custom: {
        options: async (value) => {
          const product = await Product.findByPk(value);
          if (!product) {
            throw new Error("Product not found");
          }
          return true;
        },
      },
    },
  })
);

const deleteReviewValidator = validate(
  checkSchema({
    id: {
      in: ["params"],
      notEmpty: { errorMessage: "Review ID is required" },
      isInt: { errorMessage: "Review ID must be an integer" },
      custom: {
        options: async (value) => {
          const review = await Review.findByPk(value);
          if (!review) {
            throw new Error("Review not found");
          }
          return true;
        },
      },
    },
  })
);

module.exports = {
  createReviewValidator,
  getReviewsValidator,
  getAverageRatingValidator,
  deleteReviewValidator,
};
