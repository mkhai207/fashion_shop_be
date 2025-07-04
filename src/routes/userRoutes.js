const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const userValidator = require("../validators/userValidator");

userRouter.get("/get-users", authMiddleware, userController.getAllUsers);
userRouter.get("/get-users/:id", authMiddleware, userController.getUserById);
userRouter.put(
  "/update/:id",
  authMiddleware,
  userValidator.updateUserValidator,
  userController.updateUserById
);
userRouter.delete("/delete/:id", authMiddleware, userController.deleteUserById);

module.exports = userRouter;
