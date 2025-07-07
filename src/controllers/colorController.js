const colorService = require("../services/colorService");

const createColor = async (req, res) => {
  try {
    const createColorResponse = await colorService.createColor(
      req.user,
      req.body
    );
    return res.status(201).json(createColorResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getAllColor = async (req, res) => {
  try {
    const getColorResponse = await colorService.getAllColor(req.query);
    return res.status(200).json(getColorResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getColorById = async (req, res) => {
  try {
    const getColorResponse = await colorService.getColorById(req.params.id);
    return res.status(200).json(getColorResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateColor = async (req, res) => {
  try {
    const updateColorResponse = await colorService.updateColor(
      req.user,
      req.params.id,
      req.body
    );
    return res.status(200).json(updateColorResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteColor = async (req, res) => {
  try {
    const deleteColorResponse = await colorService.deleteColor(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteColorResponse);
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
  createColor,
  getAllColor,
  getColorById,
  updateColor,
  deleteColor,
};
