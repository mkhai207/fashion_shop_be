const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController.js");
const registerValidator = require("../validators/authValidator.js");

authRouter.post("/register", registerValidator, authController.register);

module.exports = authRouter;
