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

module.exports = orderRouter;
