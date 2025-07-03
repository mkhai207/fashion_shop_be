const userRouter = require("./userRoutes");
const authRouter = require("./authRoutes");

const routes = (app) => {
  app.use("/api/v0/auth", authRouter);
  app.use("/api/v0/users", userRouter);
};

module.exports = routes;
