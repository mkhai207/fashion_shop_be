const db = require("../../models");
const Category = db.Category;
const Product = db.Product;

const createCategory = (currentUser, categoryData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new category",
          data: null,
        });
      }

      const newCategory = await Category.create({
        name: categoryData.name,
        code: categoryData.code || null,
        created_by: currentUser?.id || null,
        created_at: new Date(),
      });

      return resolve({
        status: "success",
        message: "Create category successfully",
        error: null,
        data: newCategory,
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

const getAllCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await Category.findAll();

      return resolve({
        status: "success",
        message: "Get categories successfully",
        error: null,
        data: categories,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get categories fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateCategory = (currentUser, categoryId, categoryData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new category",
          data: null,
        });
      }

      const category = await Category.findOne({ where: { id: categoryId } });

      if (!category) {
        return reject({
          statusCode: 404,
          message: "Category not found",
          error: "No category found with the provided ID",
          data: null,
        });
      }

      const updateData = {
        code:
          categoryData.code !== undefined ? categoryData.code : category.code,
        name:
          categoryData.name !== undefined ? categoryData.name : category.name,
        updated_by: currentUser.id,
        updated_at: new Date(),
      };

      const updatedCategory = await category.update(updateData);

      return resolve({
        status: "success",
        message: "Update category successfully",
        error: null,
        data: updatedCategory,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update category fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteCategory = (currentUser, categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new category",
          data: null,
        });
      }

      const category = await Category.findOne({ where: { id: categoryId } });

      if (!category) {
        return reject({
          statusCode: 404,
          message: "Category not found",
          error: "No category found with the provided ID",
          data: null,
        });
      }

      const productCount = await Product.count({
        where: { id: categoryId },
      });
      if (productCount > 0) {
        return reject({
          statusCode: 400,
          message: "Cannot delete category",
          error: "Category is associated with one or more products",
          data: null,
        });
      }

      await category.destroy();

      return resolve({
        status: "success",
        message: "Delete category successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete category fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
