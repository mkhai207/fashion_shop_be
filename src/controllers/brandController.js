const brandService = require("../services/brandService");

const createBrand = async (req, res) => {
  try {
    const createBrandResponse = await brandService.createBrand(
      req.user,
      req.body
    );
    return res.status(201).json(createBrandResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getAllBrand = async (req, res) => {
  try {
    const getBrandResponse = await brandService.getAllBrand(req.query);
    return res.status(200).json(getBrandResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getBrandById = async (req, res) => {
  try {
    const getCategoryResponse = await brandService.getBrandById(req.params.id);
    return res.status(200).json(getCategoryResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateBrand = async (req, res) => {
  try {
    const updateCategoryResponse = await brandService.updateBrand(
      req.user,
      req.params.id,
      req.body
    );
    return res.status(200).json(updateCategoryResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const deleteBrandResponse = await brandService.deleteBrand(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteBrandResponse);
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
  createBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
};
