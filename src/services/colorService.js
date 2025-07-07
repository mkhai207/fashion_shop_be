const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Color = db.Color;
const ProductVariant = db.ProductVariant;

const createColor = (currentUser, colorData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new color",
          data: null,
        });
      }

      const newColor = await Color.create({
        name: colorData.name,
        hex_code: colorData.hex_code,
      });

      return resolve({
        status: "success",
        message: "Create color successfully",
        error: null,
        data: newColor,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Create color fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getAllColor = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await buildQuery(Color, query, {
        attributes: ["id", "name", "hex_code"],
        allowedFilters: ["name", "hex_code"],
        allowedSorts: ["name"],
        defaultSort: [["name", "DESC"]],
        defaultLimit: 20,
      });

      resolve(result);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get color fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getColorById = (colorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const color = await Color.findOne({ where: { id: colorId } });

      return resolve({
        status: "success",
        message: "Get color successfully",
        error: null,
        data: color,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get color fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateColor = (currentUser, colorId, colorData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update color",
          data: null,
        });
      }

      const color = await Color.findOne({ where: { id: colorId } });

      if (!color) {
        return reject({
          statusCode: 404,
          message: "color not found",
          error: "No color found with the provided ID",
          data: null,
        });
      }

      const updateData = {
        name: colorData.name !== undefined ? colorData.name : color.name,
        hex_code:
          colorData.hex_code !== undefined
            ? colorData.hex_code
            : color.hex_code,
      };

      const updatedColor = await color.update(updateData);

      return resolve({
        status: "success",
        message: "Update color successfully",
        error: null,
        data: updatedColor,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update color fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteColor = (currentUser, colorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete color",
          data: null,
        });
      }

      const color = await Color.findOne({ where: { id: colorId } });

      if (!color) {
        return reject({
          statusCode: 404,
          message: "color not found",
          error: "No color found with the provided ID",
          data: null,
        });
      }

      const variantCount = await ProductVariant.count({
        where: { color_id: colorId },
      });
      if (variantCount > 0) {
        return reject({
          statusCode: 400,
          message: "Cannot delete color",
          error: "color is associated with one or more products",
          data: null,
        });
      }

      await color.destroy();

      return resolve({
        status: "success",
        message: "Delete color successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete color fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  createColor,
  getAllColor,
  getColorById,
  updateColor,
  deleteColor,
};
