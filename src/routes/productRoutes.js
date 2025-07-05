const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/productController");
const productValidator = require("../validators/productValidator");
const authMiddleware = require("../middlewares/authMiddleware");

productRouter.post(
  "/create-product",
  authMiddleware,
  productValidator.createProductValidator,
  productController.createProduct
);

productRouter.get("/get-products", productController.getAllProduct);

productRouter.get("/get-product/:id", productController.getProductById);

productRouter.put(
  "/update/:id",
  authMiddleware,
  productValidator.updateProductValidator,
  productController.updateProduct
);

productRouter.delete(
  "/delete/:id",
  authMiddleware,
  productController.deleteProduct
);

module.exports = productRouter;
