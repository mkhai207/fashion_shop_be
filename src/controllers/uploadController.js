const uploadService = require("../services/uploadService");

const uploadSingleImage = async (req, res) => {
  try {
    const result = await uploadService.uploadSingleImage(req.file);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in uploadSingleImageController:", error);
    res.status(400).json({
      status: "error",
      message: "Failed to upload image",
      error: error.message,
      data: null,
    });
  }
};

const uploadMultipleImages = async (req, res) => {
  try {
    const result = await uploadService.uploadMultipleImages(req.files);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in uploadMultipleImagesController:", error);
    res.status(400).json({
      status: "error",
      message: "Failed to upload images",
      error: error.message,
      data: null,
    });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
};
