const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");
const db = require("../../models");
const { Product, Order, OrderDetail, Review, ProductVariant } = db;

const createReviewValidator = validate(
  checkSchema({
    product_id: {
      in: ["body"],
      notEmpty: { errorMessage: "Product ID is required" },
      isString: { errorMessage: "Product ID must be a string" },
      custom: {
        options: async (value) => {
          // Split product IDs by comma
          const productIds = value
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id);

          if (productIds.length === 0) {
            throw new Error("At least one product ID is required");
          }

          // Check if all products exist
          for (const productId of productIds) {
            const product = await Product.findByPk(productId);
            if (!product) {
              throw new Error(`Product with ID ${productId} not found`);
            }
          }

          return true;
        },
      },
    },
    order_id: {
      in: ["body"],
      notEmpty: { errorMessage: "Order ID is required" },
      isInt: { errorMessage: "Order ID must be an integer" },
      custom: {
        options: async (value, { req }) => {
          // Check if order exists and belongs to current user
          const order = await Order.findOne({
            where: {
              id: value,
              user_id: req.user.id,
              status: "COMPLETED",
            },
            include: [
              {
                model: OrderDetail,
                as: "orderDetails",
                include: [
                  {
                    model: ProductVariant,
                    as: "variant",
                  },
                ],
              },
            ],
          });

          if (!order) {
            throw new Error(
              "Order not found or you don't have permission to review this order"
            );
          }

          // Split product IDs and check if all products exist in this order
          const productIds = req.body.product_id
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id);
          const orderProductIds = order.orderDetails.map(
            (detail) => detail.variant.product_id
          );

          for (const productId of productIds) {
            if (!orderProductIds.includes(productId)) {
              throw new Error(
                `Product with ID ${productId} not found in this order`
              );
            }
          }

          // Check if reviews already exist for any of these products in this order
          for (const productId of productIds) {
            const existingReview = await Review.findOne({
              where: {
                order_id: value,
                product_id: productId,
                user_id: req.user.id,
              },
            });

            if (existingReview) {
              throw new Error(
                `Review already exists for product ${productId} in this order`
              );
            }
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

const getReviewByOrderIdValidator = validate(
  checkSchema({
    orderId: {
      in: ["params"],
      notEmpty: { errorMessage: "Order ID is required" },
      isInt: { errorMessage: "Order ID must be an integer" },
      custom: {
        options: async (value) => {
          const order = await Order.findByPk(value);
          if (!order) {
            throw new Error("Order not found");
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
  getReviewByOrderIdValidator,
  deleteReviewValidator,
};
