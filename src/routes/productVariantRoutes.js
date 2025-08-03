const express = require("express");
const productVariantRouter = express.Router();
const productVariantController = require("../controllers/productVariantController");
const productVariantValidator = require("../validators/productVariantValidator");
const authMiddleware = require("../middlewares/authMiddleware");

productVariantRouter.post(
  "/create",
  authMiddleware,
  productVariantValidator.createProductVariantValidator,
  productVariantController.createProductVariant
);

productVariantRouter.get(
  "/get-variants",
  productVariantController.getAllVariant
);

productVariantRouter.get(
  "/get-variant/:id",
  productVariantController.getVariantById
);

productVariantRouter.put(
  "/update/:id",
  authMiddleware,
  productVariantValidator.updateProductVariantValidator,
  productVariantController.updateVariant
);

productVariantRouter.delete(
  "/delete/:id",
  authMiddleware,
  productVariantController.deleteVariant
);

productVariantRouter.post(
  "/get-variantid",
  authMiddleware,
  productVariantController.getVariantId
);

module.exports = productVariantRouter;
