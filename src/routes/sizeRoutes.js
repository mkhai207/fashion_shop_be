const express = require("express");
const sizeRouter = express.Router();
const sizeController = require("../controllers/sizeController");
const sizeValidator = require("../validators/sizeValidator");
const authMiddleware = require("../middlewares/authMiddleware");

sizeRouter.post(
  "/create-size",
  authMiddleware,
  sizeValidator.createSizeValidator,
  sizeController.createSize
);
sizeRouter.get("/get-sizes", sizeController.getAllSize);
sizeRouter.get("/get-size/:id", sizeController.getSizeById);
sizeRouter.put(
  "/update/:id",
  authMiddleware,
  sizeValidator.updateSizeValidator,
  sizeController.updateSize
);

sizeRouter.delete("/delete/:id", authMiddleware, sizeController.deleteSize);

module.exports = sizeRouter;
