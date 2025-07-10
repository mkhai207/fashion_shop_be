const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Discount = db.Discount;
const Order = db.Order;

const createDiscount = (currentUser, discountData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new discount",
          data: null,
        });
      }

      const discount = await Discount.create({
        code: discountData.code,
        name: discountData.name,
        description: discountData.description,
        discount_value: discountData.discount_value,
        discount_type: discountData.discount_type,
        valid_from: new Date(discountData.valid_from),
        valid_until: new Date(discountData.valid_until),
        minimum_order_value: discountData.minimum_order_value,
        max_discount_amount: discountData.max_discount_amount || null,
        created_by: currentUser.id,
      });

      return resolve({
        status: "success",
        message: "Create discount successfully",
        error: null,
        data: discount,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Create discount fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getDiscounts = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await buildQuery(Discount, query, {
        attributes: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "code",
          "name",
          "description",
          "discount_value",
          "discount_type",
          "valid_from",
          "valid_until",
          "minimum_order_value",
          "max_discount_amount",
        ],
        allowedFilters: ["valid_from", "valid_until"],
        allowedSorts: ["id", "created_at", "updated_at", "code"],
        defaultSort: [["created_at", "DESC"]],
        defaultLimit: 20,
      });

      resolve(result);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get discounts fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getDiscountByCode = (discountCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discount = await Discount.findOne({
        where: { code: discountCode },
      });

      return resolve({
        status: "success",
        message: "Get discount successfully",
        error: null,
        data: discount,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get discount fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateDiscount = (currentUser, discountId, discountData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update discount",
          data: null,
        });
      }

      const discount = await Discount.findOne({ where: { id: discountId } });

      if (!discount) {
        return reject({
          statusCode: 404,
          message: "Category not found",
          error: "No discount found with the provided ID",
          data: null,
        });
      }

      const updateData = {
        code:
          discountData.code !== undefined ? discountData.code : discount.code,
        name:
          discountData.name !== undefined ? discountData.name : discount.name,
        description:
          discountData.description !== undefined
            ? discountData.description
            : discount.description,
        discount_value:
          discountData.discount_value !== undefined
            ? discountData.discount_value
            : discount.discount_value,
        discount_type:
          discountData.discount_type !== undefined
            ? discountData.discount_type
            : discount.discount_type,
        valid_from:
          discountData.valid_from !== undefined
            ? discountData.valid_from
            : discount.valid_from,
        valid_until:
          discountData.valid_until !== undefined
            ? discountData.valid_until
            : discount.valid_until,
        minimum_order_value:
          discountData.minimum_order_value !== undefined
            ? discountData.minimum_order_value
            : discount.minimum_order_value,
        max_discount_amount:
          discountData.max_discount_amount !== undefined
            ? discountData.max_discount_amount
            : discount.max_discount_amount,
        updated_by: currentUser.id,
        updated_at: new Date(),
      };

      const updatedDiscount = await discount.update(updateData);

      return resolve({
        status: "success",
        message: "Update category successfully",
        error: null,
        data: updatedDiscount,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update discount fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteDiscount = (currentUser, discountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete discount",
          data: null,
        });
      }

      const discount = await Discount.findOne({ where: { id: discountId } });

      if (!discount) {
        return reject({
          statusCode: 404,
          message: "Discount not found",
          error: "No discount found with the provided ID",
          data: null,
        });
      }

      const orderCount = await Order.count({
        where: { id: discountId },
      });
      if (orderCount > 0) {
        return reject({
          statusCode: 400,
          message: "Cannot delete discount",
          error: "Discount is associated with one or more order",
          data: null,
        });
      }

      await discount.destroy();

      return resolve({
        status: "success",
        message: "Delete discount successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete discount fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  createDiscount,
  getDiscounts,
  getDiscountByCode,
  updateDiscount,
  deleteDiscount,
};
