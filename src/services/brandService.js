const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Brand = db.Brand;
const Product = db.Product;

const createBrand = (currentUser, brandData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new brand",
          data: null,
        });
      }

      const newBrand = await Brand.create({
        name: brandData.name,
        created_by: currentUser?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
        updated_by: currentUser?.id || null,
      });

      return resolve({
        status: "success",
        message: "Create brand successfully",
        error: null,
        data: newBrand,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Create category fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getAllBrand = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await buildQuery(Brand, query, {
        attributes: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "name",
        ],
        allowedFilters: ["name"],
        allowedSorts: ["id", "created_at", "updated_at", "name"],
        defaultSort: [["id", "DESC"]],
        defaultLimit: 20,
      });

      resolve(result);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get brands fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getBrandById = (brandId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const brand = await Brand.findOne({ where: { id: brandId } });

      return resolve({
        status: "success",
        message: "Get brand successfully",
        error: null,
        data: brand,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get brand fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateBrand = (currentUser, brandId, brandData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update brand",
          data: null,
        });
      }

      const brand = await Brand.findOne({ where: { id: brandId } });

      if (!brand) {
        return reject({
          statusCode: 404,
          message: "Brand not found",
          error: "No brand found with the provided ID",
          data: null,
        });
      }

      const updateData = {
        name: brandData.name !== undefined ? brandData.name : brand.name,
        updated_by: currentUser?.id || null,
        updated_at: new Date(),
      };

      const updatedBrand = await brand.update(updateData);

      return resolve({
        status: "success",
        message: "Update brand successfully",
        error: null,
        data: updatedBrand,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update brand fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteBrand = (currentUser, brandId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete brand",
          data: null,
        });
      }

      const brand = await Brand.findOne({ where: { id: brandId } });

      if (!brand) {
        return reject({
          statusCode: 404,
          message: "Brand not found",
          error: "No brand found with the provided ID",
          data: null,
        });
      }

      const productCount = await Product.count({
        where: { id: brandId },
      });
      if (productCount > 0) {
        return reject({
          statusCode: 400,
          message: "Cannot delete brand",
          error: "Brand is associated with one or more products",
          data: null,
        });
      }

      await brand.destroy();

      return resolve({
        status: "success",
        message: "Delete brand successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete brand fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  createBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
};
