const productVariantService = require("../services/productVariantService");

const createProductVariant = async (req, res) => {
  try {
    const createProductVariantResponse =
      await productVariantService.createProductVariant(req.user, req.body);
    return res.status(201).json(createProductVariantResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getAllVariant = async (req, res) => {
  try {
    const getVariantResponse = await productVariantService.getAllVariant(
      req.query
    );
    return res.status(200).json(getVariantResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getVariantById = async (req, res) => {
  try {
    const getVariantResponse = await productVariantService.getVariantById(
      req.params.id
    );
    return res.status(200).json(getVariantResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateVariant = async (req, res) => {
  try {
    const updateVariantResponse = await productVariantService.updateVariant(
      req.user,
      req.params.id,
      req.body
    );
    return res.status(200).json(updateVariantResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteVariant = async (req, res) => {
  try {
    const deleteVariantResponse = await productVariantService.deleteVariant(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteVariantResponse);
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
  createProductVariant,
  getAllVariant,
  updateVariant,
  getVariantById,
  deleteVariant,
};
