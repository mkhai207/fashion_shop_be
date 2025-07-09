const express = require("express");
const orderRouter = express.Router();
const orderController = require("../controllers/orderController");
const orderValidator = require("../validators/orderValidator");
const authMiddleware = require("../middlewares/authMiddleware");

orderRouter.post(
  "/create",
  authMiddleware,
  orderValidator.createOrderValidator,
  orderController.createOrder
);

orderRouter.post(
  "/:id/retry-payment",
  authMiddleware,
  orderController.retryPaymentHandler
);

orderRouter.get("/get-orders", orderController.getOrders);

orderRouter.get(
  "/get-orders/:id",
  authMiddleware,
  orderController.getOrderById
);

orderRouter.put(
  "/update/:id",
  authMiddleware,
  orderValidator.updateOrderStatusValidator,
  orderController.updateOrderStatus
);

module.exports = orderRouter;
