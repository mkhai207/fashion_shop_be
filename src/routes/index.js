const userRouter = require("./userRoutes");
const authRouter = require("./authRoutes");
const categoryRouter = require("./categoryRoutes");

const routes = (app) => {
  app.use("/api/v0/auth", authRouter);
  app.use("/api/v0/users", userRouter);
  app.use("/api/v0/categories", categoryRouter);
};

module.exports = routes;
