const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Color = db.Color;
const Size = db.Size;
const Cart = db.Cart;
const OrderDetail = db.OrderDetail;
const ProductVariant = db.ProductVariant;

const createProductVariant = (currentUser, variantData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new product variant",
          data: null,
        });
      }

      const date = new Date();
      const newVariant = await ProductVariant.create({
        created_at: date,
        created_by: currentUser.id,
        updated_at: date,
        updated_by: currentUser.id,
        product_id: variantData.product_id,
        size_id: variantData.size_id,
        color_id: variantData.color_id,
        quantity: variantData.quantity,
      });

      return resolve({
        status: "success",
        message: "Create product variant successfully",
        error: null,
        data: newVariant,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Create product variant fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getAllVariant = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await buildQuery(ProductVariant, query, {
        attributes: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "product_id",
          "size_id",
          "color_id",
          "quantity",
          "active",
        ],
        allowedFilters: [
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "product_id",
          "size_id",
          "color_id",
          "quantity",
          "active",
        ],
        allowedSorts: ["created_at", "updated_at", "quantity"],
        defaultSort: [["created_at", "DESC"]],
        defaultLimit: 20,
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

const getVariantById = (variantId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const variant = await ProductVariant.findOne({
        where: { id: variantId },
        include: [
          { model: Color, as: "color", attributes: ["id", "name", "hex_code"] },
          { model: Size, as: "size", attributes: ["id", "name"] },
        ],
      });

      return resolve({
        status: "success",
        message: "Get variant successfully",
        error: null,
        data: variant,
      });
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

const updateVariant = (currentUser, variantId, variantData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update variant",
          data: null,
        });
      }

      const variant = await ProductVariant.findOne({
        where: { id: variantId },
      });

      if (!variant) {
        return reject({
          statusCode: 404,
          message: "variant not found",
          error: "No variant found with the provided ID",
          data: null,
        });
      }

      const updateData = {
        updated_at: new Date(),
        updated_by: currentUser.id,
        product_id:
          variantData.product_id !== undefined
            ? variantData.product_id
            : variant.product_id,
        size_id:
          variantData.size_id !== undefined
            ? variantData.size_id
            : variant.size_id,
        color_id:
          variantData.color_id !== undefined
            ? variantData.color_id
            : variant.color_id,
        quantity:
          variantData.quantity !== undefined
            ? variantData.quantity
            : variant.quantity,
      };

      const updatedVariant = await variant.update(updateData);

      return resolve({
        status: "success",
        message: "Update variant successfully",
        error: null,
        data: updatedVariant,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update variant fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteVariant = (currentUser, variantId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete variant",
          data: null,
        });
      }

      const variant = await ProductVariant.findOne({
        where: { id: variantId },
      });

      if (!variant) {
        return reject({
          statusCode: 404,
          message: "variant not found",
          error: "No variant found with the provided ID",
          data: null,
        });
      }

      const cartCount = await Cart.count({
        where: { product_variant_id: variantId },
      });

      const orderDetailCount = await OrderDetail.count({
        where: { product_variant_id: variantId },
      });

      if (cartCount > 0 || orderDetailCount > 0) {
        variant.active = false;
        await variant.save();
        return resolve({
          status: "success",
          message: "Delete variant successfully",
          error: null,
          data: null,
        });
      }

      await variant.destroy();

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
        message: "Delete variant fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  createProductVariant,
  getAllVariant,
  updateVariant,
  getVariantById,
  deleteVariant,
};
