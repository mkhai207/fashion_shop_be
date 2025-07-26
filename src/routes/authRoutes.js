const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController.js");
const authValidator = require("../validators/authValidator.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const refreshTokenMiddleware = require("../middlewares/refreshTokenMiddleware.js");

authRouter.post(
  "/register",
  authValidator.registerValidator,
  authController.register
);

authRouter.post("/login", authValidator.loginValidator, authController.login);
authRouter.post("/logout", authMiddleware, authController.logout);
authRouter.get("/me", authMiddleware, authController.getMe);
authRouter.get("/refresh", refreshTokenMiddleware, authController.refresh);
authRouter.put("/me", authMiddleware, authController.updateMe);

module.exports = authRouter;
