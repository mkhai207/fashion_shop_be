const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../validators/categoryValidator");
const authMiddleware = require("../middlewares/authMiddleware");

categoryRouter.post(
  "/create-category",
  authMiddleware,
  categoryValidator.createCategoryValidator,
  categoryController.createCategory
);
categoryRouter.get("/get-categories", categoryController.getAllCategories);
categoryRouter.get("/get-category/:id", categoryController.getCategoryById);
categoryRouter.put(
  "/update/:id",
  authMiddleware,
  categoryValidator.updateCategoryValidator,
  categoryController.updateCategory
);

categoryRouter.delete(
  "/delete/:id",
  authMiddleware,
  categoryController.deleteCategory
);

module.exports = categoryRouter;
