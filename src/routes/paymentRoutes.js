const express = require("express");
const paymentRouter = express.Router();
const { handleVNPayReturn } = require("../controllers/paymentController");

paymentRouter.get("/vnpay-payment-return", handleVNPayReturn);

module.exports = paymentRouter;
