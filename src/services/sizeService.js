const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Size = db.Size;
const ProductVariant = db.ProductVariant;

const createSize = (currentUser, sizeData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new size",
          data: null,
        });
      }

      const newSize = await Size.create({
        name: sizeData.name,
      });

      return resolve({
        status: "success",
        message: "Create size successfully",
        error: null,
        data: newSize,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Create size fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getAllSize = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await buildQuery(Size, query, {
        attributes: ["id", "name"],
        allowedFilters: ["name"],
        allowedSorts: ["id", "name"],
        defaultSort: [["name", "DESC"]],
        defaultLimit: 20,
      });

      resolve(result);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get size fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getSizeById = (sizeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const size = await Size.findOne({ where: { id: sizeId } });

      return resolve({
        status: "success",
        message: "Get size successfully",
        error: null,
        data: size,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get size fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateSize = (currentUser, sizeId, sizeData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update size",
          data: null,
        });
      }

      const size = await Size.findOne({ where: { id: sizeId } });

      if (!size) {
        return reject({
          statusCode: 404,
          message: "size not found",
          error: "No size found with the provided ID",
          data: null,
        });
      }

      const updateData = {
        name: sizeData.name !== undefined ? sizeData.name : size.name,
      };

      const updatedSize = await size.update(updateData);

      return resolve({
        status: "success",
        message: "Update size successfully",
        error: null,
        data: updatedSize,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update size fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteSize = (currentUser, sizeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete size",
          data: null,
        });
      }

      const size = await Size.findOne({ where: { id: sizeId } });

      if (!size) {
        return reject({
          statusCode: 404,
          message: "size not found",
          error: "No size found with the provided ID",
          data: null,
        });
      }

      const variantCount = await ProductVariant.count({
        where: { size_id: sizeId },
      });
      if (variantCount > 0) {
        return reject({
          statusCode: 400,
          message: "Cannot delete size",
          error: "Size is associated with one or more products",
          data: null,
        });
      }

      await size.destroy();

      return resolve({
        status: "success",
        message: "Delete size successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete size fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  createSize,
  getAllSize,
  getSizeById,
  updateSize,
  deleteSize,
};
