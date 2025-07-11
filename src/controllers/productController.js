const productService = require("../services/productService");
const client = require("../../config/elasticSearch");

const createProduct = async (req, res) => {
  try {
    const createProductResponse = await productService.createProduct(
      req.user,
      req.body
    );
    return res.status(201).json(createProductResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const getProductResponse = await productService.getAllProduct(req.query);
    return res.status(200).json(getProductResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const getProductResponse = await productService.getProductById(
      req.params.id
    );
    return res.status(200).json(getProductResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updateProductResponse = await productService.updateProduct(
      req.user,
      req.params.id,
      req.body
    );
    return res.status(200).json(updateProductResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleteProductResponse = await productService.deleteProduct(
      req.user,
      req.params.id
    );
    return res.status(200).json(deleteProductResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const {
      q,
      gender,
      category_id,
      brand_id,
      min_price,
      max_price,
      status,
      category_name,
      brand_name,
      min_rating,
      max_rating,
      autocomplete,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const from = (pageNum - 1) * limitNum;

    if (autocomplete === "true") {
      const query = {
        index: "products",
        body: {
          query: {
            multi_match: {
              query: q,
              fields: [
                "name.autocomplete",
                "category_name.autocomplete",
                "brand_name.autocomplete",
              ],
              analyzer: "autocomplete_search",
            },
          },
          from,
          size: limitNum,
        },
      };

      const result = await client.search(query);
      const suggestions = result.hits.hits.map((hit) => ({
        id: hit._id,
        name: hit._source.name,
        category_name: hit._source.category_name,
        brand_name: hit._source.brand_name,
      }));

      return res.status(200).json({
        status: "success",
        message: "Autocomplete suggestions retrieved",
        data: {
          suggestions,
          total: result.hits.total.value,
          currentPage: pageNum,
          totalPages: Math.ceil(result.hits.total.value / limitNum),
        },
      });
    }

    const filters = [
      gender && { term: { gender } },
      category_id && { term: { category_id } },
      brand_id && { term: { brand_id } },
      category_name && { term: { "category_name.keyword": category_name } },
      brand_name && { term: { "brand_name.keyword": brand_name } },
      min_price && { range: { price: { gte: parseFloat(min_price) } } },
      max_price && { range: { price: { lte: parseFloat(max_price) } } },
      min_rating && { range: { rating: { gte: parseFloat(min_rating) } } },
      max_rating && { range: { rating: { lte: parseFloat(max_rating) } } },
      status !== undefined && { term: { status: status === "true" } },
    ].filter(Boolean);

    const query = {
      index: "products",
      body: {
        query: {
          bool: {
            must: [
              q
                ? {
                    multi_match: {
                      query: q,
                      fields: [
                        "name^2",
                        "description",
                        "category_name",
                        "brand_name",
                      ],
                    },
                  }
                : { match_all: {} },
            ],
            filter: filters,
          },
        },
        from,
        size: limitNum,
        aggs: {
          by_gender: { terms: { field: "gender", size: 10 } },
          by_category: { terms: { field: "category_name.keyword", size: 10 } },
          by_brand: { terms: { field: "brand_name.keyword", size: 10 } },
          by_rating: {
            histogram: { field: "rating", interval: 1, min_doc_count: 1 },
          },
        },
      },
    };

    const result = await client.search(query);
    res.status(200).json({
      status: "success",
      message: "Search completed",
      data: {
        products: result.hits.hits.map((hit) => ({
          id: hit._id,
          ...hit._source,
        })),
        facets: {
          genders: result.aggregations.by_gender.buckets.map((b) => ({
            key: b.key,
            count: b.doc_count,
          })),
          categories: result.aggregations.by_category.buckets.map((b) => ({
            key: b.key,
            count: b.doc_count,
          })),
          brands: result.aggregations.by_brand.buckets.map((b) => ({
            key: b.key,
            count: b.doc_count,
          })),
          ratings: result.aggregations.by_rating.buckets.map((b) => ({
            key: b.key,
            count: b.doc_count,
          })),
        },
        total: result.hits.total.value,
        currentPage: pageNum,
        totalPages: Math.ceil(result.hits.total.value / limitNum),
      },
    });
  } catch (error) {
    console.error("Error in searchProducts:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(400).json({
      status: "error",
      message: "Search failed",
      error: error.message,
      data: null,
    });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
};
