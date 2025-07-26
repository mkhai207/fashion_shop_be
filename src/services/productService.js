const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Product = db.Product;
const Brand = db.Brand;
const Category = db.Category;
const Color = db.Color;
const Size = db.Size;
const ProductVariant = db.ProductVariant;
const { v4: uuidv4 } = require("uuid");
const client = require("../../config/elasticSearch");

const createProduct = (currentUser, productData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new product",
          data: null,
        });
      }

      const product = await Product.create({
        id: uuidv4(),
        name: productData.name,
        description: productData.description,
        price: productData.price,
        gender: productData.gender,
        sold: productData.sold !== undefined ? productData.sold : 0,
        rating: 0,
        status: productData.status !== undefined ? productData.status : true,
        thumbnail: productData.thumbnail,
        slider: productData.slider,
        category_id: productData.category_id,
        brand_id: productData.brand_id,
        created_by: currentUser.id,
        updated_by: currentUser.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await syncSingleProduct(product);

      return resolve({
        status: "success",
        message: "Create product successfully",
        error: null,
        data: product,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Create category fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getAllProduct = (query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await buildQuery(Product, query, {
        attributes: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "name",
          "description",
          "price",
          "gender",
          "sold",
          "rating",
          "status",
          "thumbnail",
          "slider",
          "category_id",
          "brand_id",
        ],
        allowedFilters: [
          "name",
          "gender",
          "price",
          "sold",
          "rating",
          "status",
          "category_id",
          "brand_id",
        ],
        allowedSorts: ["created_at", "price", "sold", "rating"],
        defaultSort: [["created_at", "DESC"]],
        defaultLimit: 20,
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "name"],
          },
          {
            model: Category,
            as: "category",
            attributes: ["id", "code", "name"],
          },
        ],
      });

      resolve(result);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get products fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getProductById = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        where: { id: productId },
        include: [
          { model: Brand, as: "brand", attributes: ["id", "name"] },
          {
            model: Category,
            as: "category",
            attributes: ["id", "code", "name"],
          },
          {
            model: ProductVariant,
            as: "variants",
            attributes: ["id", "color_id", "size_id", "quantity"],
            include: [
              {
                model: Color,
                as: "color",
                attributes: ["id", "name", "hex_code"],
              },
              { model: Size, as: "size", attributes: ["id", "name"] },
            ],
          },
        ],
      });

      if (!product) {
        return reject({
          status: "error",
          message: "Product not found",
          error: null,
          data: null,
        });
      }

      const { brand_id, category_id, variants, ...sanitizedProduct } =
        product.toJSON();

      const colors = [
        ...new Map(variants.map((v) => [v.color.id, v.color])).values(),
      ];
      const sizes = [
        ...new Map(variants.map((v) => [v.size.id, v.size])).values(),
      ];
      const variantsWithStock = variants.map((v) => ({
        variantId: v.id,
        colorId: v.color_id,
        sizeId: v.size_id,
        stock: v.quantity,
        color: v.color,
        size: v.size,
      }));

      return resolve({
        status: "success",
        message: "Get product successfully",
        error: null,
        data: {
          ...sanitizedProduct,
          colors,
          sizes,
          variants: variantsWithStock,
        },
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get product fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateProduct = (currentUser, productId, productData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1 || Number(currentUser.role) !== 2) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update product",
          data: null,
        });
      }

      const product = await Product.findOne({ where: { id: productId } });

      if (!product) {
        return reject({
          statusCode: 404,
          message: "Product not found",
          error: "No product found with the provided ID",
          data: null,
        });
      }

      const updateData = {
        updated_at: new Date(),
        updated_by: currentUser.id,
        name: productData.name !== undefined ? productData.name : product.name,
        description:
          productData.description !== undefined
            ? productData.description
            : product.description,
        price:
          productData.price !== undefined ? productData.price : product.price,
        gender:
          productData.gender !== undefined
            ? productData.gender
            : product.gender,
        sold: productData.sold !== undefined ? productData.sold : product.sold,
        rating: product.rating || 0,
        status:
          productData.status !== undefined
            ? productData.status
            : product.status,
        thumbnail:
          productData.thumbnail !== undefined
            ? productData.thumbnail
            : product.thumbnail,
        slider:
          productData.slider !== undefined
            ? productData.slider
            : product.slider,
        category_id:
          productData.category_id !== undefined
            ? productData.category_id
            : product.category_id,
        brand_id:
          productData.brand_id !== undefined
            ? productData.brand_id
            : product.brand_id,
      };

      const updatedProduct = await product.update(updateData);
      await syncSingleProduct(product);

      const { brand_id, category_id, ...sanitizedProduct } =
        updatedProduct.toJSON();
      return resolve({
        status: "success",
        message: "Update product successfully",
        error: null,
        data: sanitizedProduct,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update product fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteProduct = (currentUser, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete product",
          data: null,
        });
      }

      const product = await Product.findOne({
        where: { id: productId },
      });

      if (!product) {
        return reject({
          statusCode: 404,
          message: "Product not found",
          error: "No product found with the provided ID",
          data: null,
        });
      }

      product.status = false;
      await product.save();

      return resolve({
        status: "success",
        message: "Delete product successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete product fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const syncProductsToElasticsearch = async () => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name"] },
      ],
    });

    const operations = products.flatMap((product) => [
      { index: { _index: "products", _id: product.id } },
      {
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        gender: product.gender,
        sold: product.sold || 0,
        status: product.status,
        thumbnail: product.thumbnail || "",
        slider: product.slider ? product.slider.split(",") : [],
        category_id: product.category_id,
        category_name: product.category ? product.category.name : "",
        brand_id: product.brand_id,
        brand_name: product.brand ? product.brand.name : "",
        rating: product.rating || 0,
        created_at: product.created_at,
        updated_at: product.updated_at,
        created_by: product.created_by || "",
        updated_by: product.updated_by || "",
      },
    ]);

    if (operations.length > 0) {
      const result = await client.bulk({ body: operations });
      if (result.errors) {
        console.error("Errors during bulk indexing:", result.items);
      } else {
        console.log(
          "Products synced to Elasticsearch:",
          result.items.length / 2
        );
      }
    }
  } catch (error) {
    console.error("Error syncing products to Elasticsearch:", error);
  }
};

const syncSingleProduct = async (product) => {
  try {
    const productWithRelations = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Brand, as: "brand", attributes: ["id", "name"] },
      ],
    });

    await client.index({
      index: "products",
      id: product.id,
      body: {
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: product.price,
        gender: product.gender,
        sold: product.sold || 0,
        status: product.status,
        thumbnail: product.thumbnail || "",
        slider: product.slider ? product.slider.split(",") : [], // Tách chuỗi slider bằng dấu phẩy
        category_id: product.category_id,
        category_name: productWithRelations.category
          ? productWithRelations.category.name
          : "",
        band_id: product.brand_id,
        brand_name: productWithRelations.brand
          ? productWithRelations.brand.name
          : "",
        rating: product.rating || 0,
        created_at: product.created_at,
        updated_at: product.updated_at,
        created_by: product.created_by || "",
        updated_by: product.updated_by || "",
      },
    });
    console.log(`Product ${product.id} synced to Elasticsearch`);
  } catch (error) {
    console.error(`Error syncing product ${product.id}:`, error);
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  syncProductsToElasticsearch,
  syncSingleProduct,
};
