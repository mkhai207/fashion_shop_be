const { syncProductsToElasticsearch } = require("../services/productService");

(async () => {
  await syncProductsToElasticsearch();
  process.exit(0);
})();
