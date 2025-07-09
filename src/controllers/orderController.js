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
    const result = await retryPayment(req.user, id, req.ip);
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

// const getAllCarts = async (req, res) => {
//   try {
//     const getCartsResponse = await cartService.getAllCarts(req.query);
//     return res.status(200).json(getCartsResponse);
//   } catch (error) {
//     return res.status(error.statusCode || 500).json({
//       status: "error",
//       message: error.message,
//       error: error.error,
//       data: null,
//     });
//   }
// };

// const updateCart = async (req, res) => {
//   try {
//     const updateCartResponse = await cartService.updateCart(
//       req.user,
//       req.params.id,
//       req.body
//     );
//     return res.status(200).json(updateCartResponse);
//   } catch (error) {
//     return res.status(error.statusCode || 500).json({
//       status: "error",
//       message: error.message,
//       error: error.error,
//       data: null,
//     });
//   }
// };

// const deleteCartById = async (req, res) => {
//   try {
//     const deleteCartResponse = await cartService.deleteCartById(
//       req.user,
//       req.params.id
//     );
//     return res.status(200).json(deleteCartResponse);
//   } catch (error) {
//     return res.status(error.statusCode || 500).json({
//       status: "error",
//       message: error.message,
//       error: error.error,
//       data: null,
//     });
//   }
// };

// const deleteMultiCartItems = async (req, res) => {
//   try {
//     const deleteCartResponse = await cartService.deleteMultiCartItems(
//       req.user,
//       req.body.cartIds
//     );
//     return res.status(200).json(deleteCartResponse);
//   } catch (error) {
//     return res.status(error.statusCode || 500).json({
//       status: "error",
//       message: error.message,
//       error: error.error,
//       data: null,
//     });
//   }
// };

module.exports = {
  createOrder,
  retryPaymentHandler,
};
