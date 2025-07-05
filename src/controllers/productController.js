const productService = require("../services/productService");

const createProduct = async (req, res) => {
  try {
    const createProductResponse = await productService.createProduct(
      req.user,
      req.body
    );
    return res.status(201).json(createProductResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const getProductResponse = await productService.getAllProduct(req.query);
    return res.status(200).json(getProductResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const getProductResponse = await productService.getProductById(
      req.params.id
    );
    return res.status(200).json(getProductResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updateProductResponse = await productService.updateProduct(
      req.user,
      req.params.id,
      req.body
    );
    return res.status(200).json(updateProductResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleteProductResponse = await productService.deleteProduct(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteProductResponse);
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
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
