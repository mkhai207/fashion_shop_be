const reviewService = require("../services/reviewService");

const createReview = async (req, res) => {
  try {
    const createReviewResponse = await reviewService.createReview(
      req.user,
      req.body
    );
    return res.status(201).json(createReviewResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const getReviewResponse = await reviewService.getReviews(req.query);
    return res.status(200).json(getReviewResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const getReviewAvgResponse = await reviewService.getAverageRating(
      req.params.productId
    );
    return res.status(200).json(getReviewAvgResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const deleteReviewResponse = await reviewService.deleteReview(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteReviewResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

module.exports = {
  createReview,
  getReviews,
  getAverageRating,
  deleteReview,
};
