const client = require("../../config/elasticSearch");

async function createProductsIndex() {
  try {
    const exists = await client.indices.exists({ index: "products" });
    if (exists) {
      console.log("Index 'products' already exists");
      return;
    }

    await client.indices.create({
      index: "products",
      body: {
        settings: {
          analysis: {
            analyzer: {
              autocomplete: {
                tokenizer: "autocomplete",
                filter: ["lowercase"],
              },
              autocomplete_search: {
                tokenizer: "lowercase",
              },
            },
            tokenizer: {
              autocomplete: {
                type: "edge_ngram",
                min_gram: 2,
                max_gram: 10,
                token_chars: ["letter", "digit"],
              },
            },
          },
        },
        mappings: {
          properties: {
            id: { type: "keyword" },
            name: {
              type: "text",
              analyzer: "standard",
              fields: {
                autocomplete: { type: "text", analyzer: "autocomplete" },
              },
            },
            description: { type: "text", analyzer: "standard" },
            price: { type: "double" },
            gender: { type: "keyword" },
            sold: { type: "integer" },
            status: { type: "boolean" },
            thumbnail: { type: "keyword" },
            slider: { type: "keyword" },
            category_id: { type: "keyword" },
            category_name: {
              type: "text",
              analyzer: "standard",
              fields: {
                keyword: { type: "keyword" },
                autocomplete: { type: "text", analyzer: "autocomplete" },
              },
            },
            brand_id: { type: "keyword" },
            brand_name: {
              type: "text",
              analyzer: "standard",
              fields: {
                keyword: { type: "keyword" },
                autocomplete: { type: "text", analyzer: "autocomplete" },
              },
            },
            rating: { type: "float" },
            created_at: { type: "date" },
            updated_at: { type: "date" },
            created_by: { type: "keyword" },
            updated_by: { type: "keyword" },
          },
        },
      },
    });
    console.log("Index 'products' created successfully");
  } catch (error) {
    console.error("Error creating index:", error);
  }
}

createProductsIndex();
