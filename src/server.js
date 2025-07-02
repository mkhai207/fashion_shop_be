require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");
const path = require("path");
const sequelize = require("../config/database");
// const routes = require("../routes");

const app = express();

// Middleware
app.use(express.json());

// Swagger
const swaggerDocument = yaml.load(
  path.join(__dirname, "../config/swagger.yaml")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
// app.use("/api/v1", routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Test connection and start server
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    // Đồng bộ models (tùy chọn, nếu không dùng migration)
    // await sequelize.sync({ force: false });
    const port = process.env.PORT || 8080;
    const hostname = process.env.HOSTNAME || "localhost";
    app.listen(port, () => {
      console.log(`Example app listening at http://${hostname}:${port}`);
      console.log(
        `Swagger UI available at http://${hostname}:${port}/api-docs`
      );
    });
  } catch (error) {
    console.error(">> Error connecting to DB: ", error);
  }
})();
