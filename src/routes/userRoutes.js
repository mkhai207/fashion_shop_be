const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

userRouter.get("/get-users", authMiddleware, userController.getAllUsers);

module.exports = userRouter;
