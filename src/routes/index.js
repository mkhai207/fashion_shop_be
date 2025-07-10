const userRouter = require("./userRoutes");
const authRouter = require("./authRoutes");
const categoryRouter = require("./categoryRoutes");
const brandRouter = require("./brandRoutes");
const productRouter = require("./productRoutes");
const sizeRouter = require("./sizeRoutes");
const colorRouter = require("./colorRoutes");
const productVariantRouter = require("./productVariantRoutes");
const cartRouter = require("./cartRoutes");
const orderRouter = require("./orderRoutes");
const paymentRouter = require("./paymentRoutes");
const discountRouter = require("./discountRoutes");

const routes = (app) => {
  app.use("/api/v0/auth", authRouter);
  app.use("/api/v0/users", userRouter);
  app.use("/api/v0/categories", categoryRouter);
  app.use("/api/v0/brands", brandRouter);
  app.use("/api/v0/products", productRouter);
  app.use("/api/v0/sizes", sizeRouter);
  app.use("/api/v0/colors", colorRouter);
  app.use("/api/v0/variants", productVariantRouter);
  app.use("/api/v0/carts", cartRouter);
  app.use("/api/v0/orders", orderRouter);
  app.use("/api/v0/payment", paymentRouter);
  app.use("/api/v0/discounts", discountRouter);
};

module.exports = routes;
