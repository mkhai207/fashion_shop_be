const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Product = db.Product;
const Brand = db.Brand;
const Category = db.Category;
const { v4: uuidv4 } = require("uuid");

const createProduct = (currentUser, productData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new product",
          data: null,
        });
      }

      const product = await Product.create({
        id: uuidv4(),
        name: productData.name,
        description: productData.description,
        price: productData.price,
        gender: productData.gender,
        sold: productData.sold !== undefined ? productData.sold : 0,
        status: productData.status !== undefined ? productData.status : true,
        thumbnail: productData.thumbnail,
        slider: productData.slider,
        category_id: productData.category_id,
        brand_id: productData.brand_id,
        created_by: currentUser.id,
        updated_by: currentUser.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return resolve({
        status: "success",
        message: "Create product successfully",
        error: null,
        data: product,
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

const getAllProduct = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await buildQuery(Product, query, {
        attributes: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "name",
          "description",
          "price",
          "gender",
          "sold",
          "status",
          "thumbnail",
          "slider",
          "category_id",
          "brand_id",
        ],
        allowedFilters: [
          "name",
          "gender",
          "price",
          "sold",
          "status",
          "category_id",
          "brand_id",
        ],
        allowedSorts: ["created_at", "price", "sold"],
        defaultSort: [["created_at", "DESC"]],
        defaultLimit: 20,
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", "code", "name"],
          },
        ],
      });

      resolve(result);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get products fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getProductById = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        where: { id: productId },
        include: [
          { model: Brand, as: "brand", attributes: ["id", "name"] },
          {
            model: Category,
            as: "category",
            attributes: ["id", "code", "name"],
          },
        ],
      });

      const { brand_id, category_id, ...sanitizedProduct } = product.toJSON();

      return resolve({
        status: "success",
        message: "Get product successfully",
        error: null,
        data: sanitizedProduct,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get product fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateProduct = (currentUser, productId, productData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1 || Number(currentUser.role) !== 2) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update product",
          data: null,
        });
      }

      const product = await Product.findOne({ where: { id: productId } });

      if (!product) {
        return reject({
          statusCode: 404,
          message: "Product not found",
          error: "No product found with the provided ID",
          data: null,
        });
      }

      const updateData = {
        updated_at: new Date(),
        updated_by: currentUser.id,
        name: productData.name !== undefined ? productData.name : product.name,
        description:
          productData.description !== undefined
            ? productData.description
            : product.description,
        price:
          productData.price !== undefined ? productData.price : product.price,
        gender:
          productData.gender !== undefined
            ? productData.gender
            : product.gender,
        sold: productData.sold !== undefined ? productData.sold : product.sold,
        status:
          productData.status !== undefined
            ? productData.status
            : product.status,
        thumbnail:
          productData.thumbnail !== undefined
            ? productData.thumbnail
            : product.thumbnail,
        slider:
          productData.slider !== undefined
            ? productData.slider
            : product.slider,
        category_id:
          productData.category_id !== undefined
            ? productData.category_id
            : product.category_id,
        brand_id:
          productData.brand_id !== undefined
            ? productData.brand_id
            : product.brand_id,
      };

      const updatedProduct = await product.update(updateData);

      const { brand_id, category_id, ...sanitizedProduct } =
        updatedProduct.toJSON();
      return resolve({
        status: "success",
        message: "Update product successfully",
        error: null,
        data: sanitizedProduct,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update product fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteProduct = (currentUser, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete product",
          data: null,
        });
      }

      const product = await Product.findOne({
        where: { id: productId },
      });

      if (!product) {
        return reject({
          statusCode: 404,
          message: "Product not found",
          error: "No product found with the provided ID",
          data: null,
        });
      }

      product.status = false;
      await product.save();

      return resolve({
        status: "success",
        message: "Delete product successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete product fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
