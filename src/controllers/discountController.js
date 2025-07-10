const discountService = require("../services/discountService");

const createDiscount = async (req, res) => {
  try {
    const createDiscountResponse = await discountService.createDiscount(
      req.user,
      req.body
    );
    return res.status(201).json(createDiscountResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getDiscounts = async (req, res) => {
  try {
    const getDiscountResponse = await discountService.getDiscounts(req.query);
    return res.status(200).json(getDiscountResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getDiscountByCode = async (req, res) => {
  try {
    const getDiscountResponse = await discountService.getDiscountByCode(
      req.params.code
    );
    return res.status(200).json(getDiscountResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateDiscount = async (req, res) => {
  try {
    const updateDiscountResponse = await discountService.updateDiscount(
      req.user,
      req.params.id,
      req.body
    );
    return res.status(200).json(updateDiscountResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const deleteDiscountResponse = await discountService.deleteDiscount(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteDiscountResponse);
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
  createDiscount,
  getDiscounts,
  getDiscountByCode,
  updateDiscount,
  deleteDiscount,
};
