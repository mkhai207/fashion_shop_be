const express = require("express");
const colorRouter = express.Router();
const colorController = require("../controllers/colorController");
const colorValidator = require("../validators/colorValidator");
const authMiddleware = require("../middlewares/authMiddleware");

colorRouter.post(
  "/create-color",
  authMiddleware,
  colorValidator.createColorValidator,
  colorController.createColor
);
colorRouter.get("/get-colors", colorController.getAllColor);
colorRouter.get("/get-color/:id", colorController.getColorById);
colorRouter.put(
  "/update/:id",
  authMiddleware,
  colorValidator.updateColorValidator,
  colorController.updateColor
);

colorRouter.delete("/delete/:id", authMiddleware, colorController.deleteColor);

module.exports = colorRouter;
