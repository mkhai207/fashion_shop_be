const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Review = db.Review;
const Sequelize = db.sequelize;
const Product = db.Product;

const createReview = (currentUser, reviewData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 3) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new review",
          data: null,
        });
      }

      const review = await Review.create({
        user_id: currentUser.id,
        product_id: reviewData.product_id,
        rating: reviewData.rating,
        comment: reviewData.comment || null,
        images: reviewData.images || null,
        created_by: currentUser.id,
        updated_by: currentUser.id,
      });

      const allReviews = await Review.findAll({
        where: { product_id: reviewData.product_id },
        attributes: ["rating"],
      });

      const averageRating =
        allReviews.reduce((acc, cur) => acc + cur.rating, 0) /
        allReviews.length;

      await Product.update(
        { rating: averageRating },
        { where: { id: reviewData.product_id } }
      );

      return resolve({
        status: "success",
        message: "Create review successfully",
        error: null,
        data: review,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Create review fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getReviews = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await buildQuery(Review, query, {
        attributes: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "rating",
          "comment",
          "images",
          "user_id",
          "product_id",
        ],
        allowedFilters: [
          "id",
          "created_at",
          "rating",
          "images",
          "user_id",
          "product_id",
        ],
        allowedSorts: ["rating", "created_at"],
        defaultSort: [["rating", "DESC"]],
        defaultLimit: 20,
      });

      resolve(result);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get reviews fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getAverageRating = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Review.findAll({
        where: { product_id: productId },
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "totalReviews"],
        ],
        raw: true,
      });

      const { averageRating, totalReviews } = result[0];
      resolve({
        status: "success",
        message: "Average rating retrieved successfully",
        error: null,
        data: {
          averageRating: parseFloat(averageRating) || 0,
          totalReviews: parseInt(totalReviews) || 0,
        },
      });
    } catch (error) {
      console.error("Error in getAverageRating:", {
        message: error.message,
        stack: error.stack,
      });
      reject({
        status: "error",
        message: "Failed to retrieve average rating",
        error: error.message,
        data: null,
      });
    }
  });
};
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (Number(currentUser.role) !== 1) {
//         return reject({
//           statusCode: 403,
//           message: "Forbidden",
//           error: "You do not have permission to update discount",
//           data: null,
//         });
//       }

//       const discount = await Discount.findOne({ where: { id: discountId } });

//       if (!discount) {
//         return reject({
//           statusCode: 404,
//           message: "Category not found",
//           error: "No discount found with the provided ID",
//           data: null,
//         });
//       }

//       const updateData = {
//         code:
//           discountData.code !== undefined ? discountData.code : discount.code,
//         name:
//           discountData.name !== undefined ? discountData.name : discount.name,
//         description:
//           discountData.description !== undefined
//             ? discountData.description
//             : discount.description,
//         discount_value:
//           discountData.discount_value !== undefined
//             ? discountData.discount_value
//             : discount.discount_value,
//         discount_type:
//           discountData.discount_type !== undefined
//             ? discountData.discount_type
//             : discount.discount_type,
//         valid_from:
//           discountData.valid_from !== undefined
//             ? discountData.valid_from
//             : discount.valid_from,
//         valid_until:
//           discountData.valid_until !== undefined
//             ? discountData.valid_until
//             : discount.valid_until,
//         minimum_order_value:
//           discountData.minimum_order_value !== undefined
//             ? discountData.minimum_order_value
//             : discount.minimum_order_value,
//         max_discount_amount:
//           discountData.max_discount_amount !== undefined
//             ? discountData.max_discount_amount
//             : discount.max_discount_amount,
//         updated_by: currentUser.id,
//         updated_at: new Date(),
//       };

//       const updatedDiscount = await discount.update(updateData);

//       return resolve({
//         status: "success",
//         message: "Update category successfully",
//         error: null,
//         data: updatedDiscount,
//       });
//     } catch (error) {
//       console.log(error);
//       reject({
//         status: "error",
//         message: "Update discount fail",
//         error: error.message,
//         data: null,
//       });
//     }
//   });
// };

const deleteReview = (currentUser, reviewId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete review",
          data: null,
        });
      }

      const review = await Review.findOne({ where: { id: reviewId } });

      await review.destroy();

      return resolve({
        status: "success",
        message: "Delete review successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete review fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  createReview,
  getReviews,
  getAverageRating,
  deleteReview,
};
