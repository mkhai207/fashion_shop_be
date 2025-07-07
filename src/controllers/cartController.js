const cartService = require("../services/cartService");

const addToCart = async (req, res) => {
  try {
    const addToCartResponse = await cartService.addToCart(req.user, req.body);
    return res.status(201).json(addToCartResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getAllCarts = async (req, res) => {
  try {
    const getCartsResponse = await cartService.getAllCarts(req.query);
    return res.status(200).json(getCartsResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const updateCartResponse = await cartService.updateCart(
      req.user,
      req.params.id,
      req.body
    );
    return res.status(200).json(updateCartResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteCartById = async (req, res) => {
  try {
    const deleteCartResponse = await cartService.deleteCartById(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteCartResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteMultiCartItems = async (req, res) => {
  try {
    const deleteCartResponse = await cartService.deleteMultiCartItems(
      req.user,
      req.body.cartIds
    );
    return res.status(200).json(deleteCartResponse);
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
  addToCart,
  getAllCarts,
  updateCart,
  deleteCartById,
  deleteMultiCartItems,
};
