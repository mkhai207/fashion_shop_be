const express = require("express");
const reviewRouter = express.Router();
const reviewController = require("../controllers/reviewController");
const reviewValidator = require("../validators/reviewValidator");
const authMiddleware = require("../middlewares/authMiddleware");

reviewRouter.post(
  "/create-review",
  authMiddleware,
  reviewValidator.createReviewValidator,
  reviewController.createReview
);

reviewRouter.get("/get-reviews", reviewController.getReviews);

reviewRouter.get(
  "/product/:productId/average",
  reviewValidator.getAverageRatingValidator,
  reviewController.getAverageRating
);

reviewRouter.get(
  "/get-reviews/:productId",
  reviewController.getReviewByProductId
);

reviewRouter.delete(
  "/delete-review/:id",
  authMiddleware,
  reviewValidator.deleteReviewValidator,
  reviewController.deleteReview
);

module.exports = reviewRouter;
