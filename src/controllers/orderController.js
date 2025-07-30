const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
  try {
    const createOrderResponse = await orderService.createOrder(
      req.user,
      req.body
    );
    return res.status(201).json(createOrderResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const retryPaymentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orderService.retryPayment(req.user, id, req.ip);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "Failed to retry payment",
      error: error.message,
      data: null,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const getOrderResponse = await orderService.getOrders(req.user, req.query);
    return res.status(200).json(getOrderResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const getOrderResponse = await orderService.getOrderById(
      req.user,
      req.params.id
    );
    return res.status(200).json(getOrderResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const updateOrderResponse = await orderService.updateOrderStatus(
      req.user,
      req.params.id,
      req.body.status
    );
    return res.status(200).json(updateOrderResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

module.exports = {
  createOrder,
  retryPaymentHandler,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
