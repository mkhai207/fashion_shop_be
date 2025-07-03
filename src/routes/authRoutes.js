const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController.js");
const authValidator = require("../validators/authValidator.js");

authRouter.post(
  "/register",
  authValidator.registerValidator,
  authController.register
);

authRouter.post("/login", authValidator.loginValidator, authController.login);

module.exports = authRouter;
