const express = require("express");
const brandRouter = express.Router();
const brandController = require("../controllers/brandController");
const brandValidator = require("../validators/brandValidator");
const authMiddleware = require("../middlewares/authMiddleware");

brandRouter.post(
  "/create-brand",
  authMiddleware,
  brandValidator.createBrandValidator,
  brandController.createBrand
);
brandRouter.get("/get-brands", brandController.getAllBrand);
brandRouter.get("/get-brand/:id", brandController.getBrandById);
brandRouter.put(
  "/update/:id",
  authMiddleware,
  brandValidator.updateBrandValidator,
  brandController.updateBrand
);

brandRouter.delete("/delete/:id", authMiddleware, brandController.deleteBrand);

module.exports = brandRouter;
