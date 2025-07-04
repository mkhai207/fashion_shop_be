const categoryService = require("../services/categoryService");

const createCategory = async (req, res) => {
  try {
    const getCategoryResponse = await categoryService.createCategory(
      req.user,
      req.body
    );
    return res.status(201).json(getCategoryResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const getCategoryResponse = await categoryService.getAllCategories();
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

const updateCategory = async (req, res) => {
  try {
    const updateCategoryResponse = await categoryService.updateCategory(
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

const deleteCategory = async (req, res) => {
  try {
    const deleteCategoryResponse = await categoryService.deleteCategory(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteCategoryResponse);
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
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
