const sizeService = require("../services/sizeService");

const createSize = async (req, res) => {
  try {
    const createSizeResponse = await sizeService.createSize(req.user, req.body);
    return res.status(201).json(createSizeResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getAllSize = async (req, res) => {
  try {
    const getSizeResponse = await sizeService.getAllSize(req.query);
    return res.status(200).json(getSizeResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getSizeById = async (req, res) => {
  try {
    const getSizeResponse = await sizeService.getSizeById(req.params.id);
    return res.status(200).json(getSizeResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateSize = async (req, res) => {
  try {
    const updateSizeResponse = await sizeService.updateSize(
      req.user,
      req.params.id,
      req.body
    );
    return res.status(200).json(updateSizeResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteSize = async (req, res) => {
  try {
    const deleteSizeResponse = await sizeService.deleteSize(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteSizeResponse);
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
  createSize,
  getAllSize,
  getSizeById,
  updateSize,
  deleteSize,
};
