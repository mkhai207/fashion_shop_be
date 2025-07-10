const express = require("express");
const discountRouter = express.Router();
const discountController = require("../controllers/discountController");
const discountValidator = require("../validators/discountValidator");
const authMiddleware = require("../middlewares/authMiddleware");

discountRouter.post(
  "/create-discount",
  authMiddleware,
  discountValidator.createDiscountValidator,
  discountController.createDiscount
);

discountRouter.get("/get-discounts", discountController.getDiscounts);
discountRouter.get(
  "/get-discount/:code",
  discountValidator.getDiscountValidator,
  discountController.getDiscountByCode
);

discountRouter.put(
  "/update-discount/:id",
  authMiddleware,
  discountValidator.updateDiscountValidator,
  discountController.updateDiscount
);

discountRouter.delete(
  "/delete-discount/:id",
  authMiddleware,
  discountController.deleteDiscount
);

module.exports = discountRouter;
