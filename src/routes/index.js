const userRouter = require("./userRoutes");
const authRouter = require("./authRoutes");
const categoryRouter = require("./categoryRoutes");
const brandRouter = require("./brandRoutes");

const routes = (app) => {
  app.use("/api/v0/auth", authRouter);
  app.use("/api/v0/users", userRouter);
  app.use("/api/v0/categories", categoryRouter);
  app.use("/api/v0/brands", brandRouter);
};

module.exports = routes;
