const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Color = db.Color;
const Size = db.Size;
const Cart = db.Cart;
const ProductVariant = db.ProductVariant;
const Product = db.Product;

const addToCart = (currentUser, cartData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { product_id, color_id, size_id, quantity } = cartData;
      const date = new Date();

      const variant = await ProductVariant.findOne({
        where: {
          product_id,
          color_id,
          size_id,
          active: true,
        },
      });

      if (!variant) {
        return reject({
          status: "error",
          message: "Product variant not found",
          error: null,
          data: null,
        });
      }

      const parsedQuantity = parseInt(quantity, 10);
      if (parsedQuantity > variant.quantity) {
        throw new Error(
          `Quantity exceeds available stock (${variant.quantity})`
        );
      }

      let cart;
      const existingCartItem = await Cart.findOne({
        where: {
          user_id: currentUser.id,
          product_variant_id: variant.id,
        },
      });

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + parsedQuantity;
        if (newQuantity > variant.quantity) {
          throw new Error(
            `Total quantity exceeds available stock (${variant.quantity})`
          );
        }
        cart = await existingCartItem.update({
          quantity: newQuantity,
          updated_at: date,
          updated_by: currentUser.id,
        });
      } else {
        cart = await Cart.create({
          created_at: date,
          created_by: currentUser.id,
          updated_at: date,
          updated_by: currentUser.id,
          product_variant_id: variant.id,
          quantity: parsedQuantity,
          user_id: currentUser.id,
        });
      }

      const cartDetail = await Cart.findByPk(cart.id, {
        include: [
          {
            model: ProductVariant,
            as: "variant",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "price"],
              },
              { model: Size, as: "size", attributes: ["id", "name"] },
              {
                model: Color,
                as: "color",
                attributes: ["id", "name", "hex_code"],
              },
            ],
          },
        ],
      });

      resolve({
        status: "success",
        message: "Add to cart successfully",
        error: null,
        data: cartDetail,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Add to cart fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getAllCarts = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await buildQuery(Cart, query, {
        attributes: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "product_variant_id",
          "quantity",
          "user_id",
        ],
        allowedFilters: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "product_variant_id",
          "quantity",
          "user_id",
        ],
        allowedSorts: ["created_at", "updated_at", "quantity"],
        defaultSort: [["created_at", "DESC"]],
        defaultLimit: 20,
        include: [
          {
            model: ProductVariant,
            as: "variant",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "price"],
              },
              { model: Size, as: "size", attributes: ["id", "name"] },
              {
                model: Color,
                as: "color",
                attributes: ["id", "name", "hex_code"],
              },
            ],
          },
        ],
      });

      resolve(result);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get variant fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateCart = (currentUser, cartId, cartData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({
        where: { id: cartId },
      });

      if (!cart) {
        return reject({
          statusCode: 404,
          message: "cart not found",
          error: "No cart found with the provided ID",
          data: null,
        });
      }

      const isOwner = Number(currentUser.id) === Number(cart.user_id);

      if (!isOwner) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update cart",
          data: null,
        });
      }

      const updateData = {
        updated_at: new Date(),
        updated_by: currentUser.id,
        product_variant_id:
          cartData.product_variant_id !== undefined
            ? cartData.product_variant_id
            : cart.product_variant_id,
        quantity:
          cartData.quantity !== undefined ? cartData.quantity : cart.quantity,
      };

      const updatedCart = await cart.update(updateData);

      const cartDetail = await Cart.findByPk(cart.id, {
        include: [
          {
            model: ProductVariant,
            as: "variant",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "price"],
              },
              { model: Size, as: "size", attributes: ["id", "name"] },
              {
                model: Color,
                as: "color",
                attributes: ["id", "name", "hex_code"],
              },
            ],
          },
        ],
      });

      return resolve({
        status: "success",
        message: "Update cart successfully",
        error: null,
        data: cartDetail,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update cart fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteCartById = (currentUser, cartId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({
        where: { id: cartId },
      });

      if (!cart) {
        return reject({
          statusCode: 404,
          message: "cart not found",
          error: "No cart found with the provided ID",
          data: null,
        });
      }

      const isOwner = Number(currentUser.id) === Number(cart.user_id);

      if (!isOwner) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete cart",
          data: null,
        });
      }

      await cart.destroy();

      return resolve({
        status: "success",
        message: "Delete variant successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete cart fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteMultiCartItems = (currentUser, cartIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cartItems = await Cart.findAll({
        where: { id: cartIds, user_id: currentUser.id },
      });

      if (cartItems.length !== cartIds.length) {
        return reject({
          statusCode: 404,
          message: "Cart not found",
          error: "Some cart items do not exist",
          data: null,
        });
      }
      await Cart.destroy({ where: { id: cartIds } });

      return resolve({
        status: "success",
        message: "Delete cart items successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete cart items fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  addToCart,
  getAllCarts,
  updateCart,
  deleteCartById,
  deleteMultiCartItems,
};
