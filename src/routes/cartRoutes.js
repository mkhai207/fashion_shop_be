const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cartController");
const cartValidator = require("../validators/cartValidator");
const authMiddleware = require("../middlewares/authMiddleware");

cartRouter.post(
  "/create",
  authMiddleware,
  cartValidator.addToCartValidator,
  cartController.addToCart
);

cartRouter.get("/get-carts", authMiddleware, cartController.getAllCarts);

cartRouter.get("/get-my-cart", authMiddleware, cartController.getMyCart);

cartRouter.put(
  "/update/:id",
  authMiddleware,
  cartValidator.updateCartValidator,
  cartController.updateCart
);

cartRouter.delete("/delete/:id", authMiddleware, cartController.deleteCartById);

cartRouter.delete(
  "/delete",
  authMiddleware,
  cartValidator.deleteMultipleCartItemsValidator,
  cartController.deleteMultiCartItems
);

cartRouter.delete("/delete-all", authMiddleware, cartController.deleteAllCart);

module.exports = cartRouter;
