const express = require("express");
const uploadRouter = express.Router();
const uploadController = require("../controllers/uploadController");
const uploadValidator = require("../validators/uploadValidator");
const upload = require("../middlewares/multer");

uploadRouter.post(
  "/image",
  upload.single("image"),
  uploadValidator.uploadSingleImageValidator,
  uploadController.uploadSingleImage
);
uploadRouter.post(
  "/images",
  upload.array("images", 10),
  uploadValidator.uploadMultipleImagesValidator,
  uploadController.uploadMultipleImages
);

module.exports = uploadRouter;
