const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const Product = db.Product;
const Brand = db.Brand;
const Category = db.Category;
const Color = db.Color;
const Size = db.Size;
const ProductVariant = db.ProductVariant;
const sequelize = db.sequelize;
const Cart = db.Cart;
const OrderDetail = db.OrderDetail;
const { v4: uuidv4 } = require("uuid");
const client = require("../../config/elasticSearch");

// const createProduct = (currentUser, productData) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (Number(currentUser.role) !== 1) {
//         return reject({
//           statusCode: 403,
//           message: "Forbidden",
//           error: "You do not have permission to create new product",
//           data: null,
//         });
//       }

//       const product = await Product.create({
//         id: uuidv4(),
//         name: productData.name,
//         description: productData.description,
//         price: productData.price,
//         gender: productData.gender,
//         sold: productData.sold !== undefined ? productData.sold : 0,
//         rating: 0,
//         status: productData.status !== undefined ? productData.status : true,
//         thumbnail: productData.thumbnail,
//         slider: productData.slider,
//         category_id: productData.category_id,
//         brand_id: productData.brand_id,
//         created_by: currentUser.id,
//         updated_by: currentUser.id,
//         created_at: new Date(),
//         updated_at: new Date(),
//       });
//       await syncSingleProduct(product);

//       return resolve({
//         status: "success",
//         message: "Create product successfully",
//         error: null,
//         data: product,
//       });
//     } catch (error) {
//       console.log(error);
//       reject({
//         status: "error",
//         message: "Create category fail",
//         error: error.message,
//         data: null,
//       });
//     }
//   });
// };

const createProduct = (currentUser, productData) => {
  return new Promise(async (resolve, reject) => {
    const transaction = await sequelize.transaction();

    try {
      // Check permissions
      if (Number(currentUser.role) !== 1) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to create new product",
          data: null,
        });
      }

      // Validate required fields
      if (
        !productData.name ||
        !productData.price ||
        !productData.gender ||
        !productData.category_id ||
        !productData.brand_id ||
        !productData.variants ||
        !Array.isArray(productData.variants) ||
        productData.variants.length === 0
      ) {
        await transaction.rollback();
        return reject({
          statusCode: 400,
          message: "Bad Request",
          error:
            "Missing required fields: name, price, gender, category_id, brand_id, variants",
          data: null,
        });
      }

      // Step 1: Create/Get Colors and Sizes
      const colorMap = new Map();
      const sizeMap = new Map();

      // Collect all unique colors and sizes from variants
      const uniqueColors = new Set();
      const uniqueSizes = new Set();

      productData.variants.forEach((variant) => {
        uniqueColors.add(variant.hex_code);
        variant.inventory.forEach((item) => {
          uniqueSizes.add(item.size);
        });
      });

      // Process Colors
      for (const hexCode of uniqueColors) {
        try {
          // Try to find existing color by hex_code
          let color = await Color.findOne({
            where: { hex_code: hexCode },
            transaction,
          });

          if (!color) {
            // Create new color with a default name based on hex code
            const colorName =
              hexCode === "#000000"
                ? "Black"
                : hexCode === "#FFFFFF"
                ? "White"
                : hexCode === "#FF0000"
                ? "Red"
                : hexCode === "#00FF00"
                ? "Green"
                : hexCode === "#0000FF"
                ? "Blue"
                : `Color ${hexCode}`;

            color = await Color.create(
              {
                name: colorName,
                hex_code: hexCode,
              },
              { transaction }
            );
          }

          colorMap.set(hexCode, color.id);
        } catch (error) {
          console.error(`Error processing color ${hexCode}:`, error);
          await transaction.rollback();
          return reject({
            statusCode: 500,
            message: "Error processing colors",
            error: error.message,
            data: null,
          });
        }
      }

      // Process Sizes
      for (const sizeName of uniqueSizes) {
        try {
          let size = await Size.findOne({
            where: { name: sizeName },
            transaction,
          });

          if (!size) {
            size = await Size.create(
              {
                name: sizeName,
              },
              { transaction }
            );
          }

          sizeMap.set(sizeName, size.id);
        } catch (error) {
          console.error(`Error processing size ${sizeName}:`, error);
          await transaction.rollback();
          return reject({
            statusCode: 500,
            message: "Error processing sizes",
            error: error.message,
            data: null,
          });
        }
      }

      // Step 2: Create Product
      const productId = uuidv4();

      const product = await Product.create(
        {
          id: productId,
          name: productData.name,
          description: productData.description || "",
          price: parseFloat(productData.price),
          gender: productData.gender,
          sold: productData.sold ? parseInt(productData.sold) : 0,
          rating: 0,
          status: productData.status !== undefined ? productData.status : true,
          thumbnail: productData.thumbnail || "",
          slider: productData.slider || "",
          category_id: parseInt(productData.category_id),
          brand_id: parseInt(productData.brand_id),
          created_by: currentUser.id,
          updated_by: currentUser.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction }
      );

      // Step 3: Create Product Variants
      const createdVariants = [];

      for (const variant of productData.variants) {
        const colorId = colorMap.get(variant.hex_code);

        if (!colorId) {
          await transaction.rollback();
          return reject({
            statusCode: 400,
            message: "Invalid color data",
            error: `Color with hex_code ${variant.hex_code} not found`,
            data: null,
          });
        }

        for (const inventoryItem of variant.inventory) {
          const sizeId = sizeMap.get(inventoryItem.size);

          if (!sizeId) {
            await transaction.rollback();
            return reject({
              statusCode: 400,
              message: "Invalid size data",
              error: `Size ${inventoryItem.size} not found`,
              data: null,
            });
          }

          try {
            const existingVariant = await ProductVariant.findOne({
              where: {
                product_id: productId,
                size_id: sizeId,
                color_id: colorId,
              },
              transaction,
            });

            if (existingVariant) {
              console.warn(
                `Variant already exists for product ${productId}, size ${sizeId}, color ${colorId}`
              );
              continue;
            }

            const productVariant = await ProductVariant.create(
              {
                product_id: productId,
                size_id: sizeId,
                color_id: colorId,
                quantity: parseInt(inventoryItem.quantity) || 0,
                active: true,
                created_by: currentUser.id,
                updated_by: currentUser.id,
                created_at: new Date(),
                updated_at: new Date(),
              },
              { transaction }
            );

            createdVariants.push(productVariant);
          } catch (error) {
            console.error(`Error creating variant:`, error);
            await transaction.rollback();
            return reject({
              statusCode: 500,
              message: "Error creating product variants",
              error: error.message,
              data: null,
            });
          }
        }
      }

      await transaction.commit();

      try {
        await syncSingleProduct(product);
      } catch (syncError) {
        console.warn("Sync error (non-critical):", syncError);
      }

      const completeProduct = await Product.findByPk(productId, {
        include: [
          {
            model: ProductVariant,
            as: "variants",
            include: [
              { model: Size, as: "size" },
              { model: Color, as: "color" },
            ],
          },
          { model: Category, as: "category" },
          { model: Brand, as: "brand" },
        ],
      });

      return resolve({
        status: "success",
        message: "Create product successfully",
        error: null,
        data: {
          product: completeProduct,
          createdVariants: createdVariants.length,
          createdColors: Array.from(uniqueColors).length,
          createdSizes: Array.from(uniqueSizes).length,
        },
      });
    } catch (error) {
      await transaction.rollback();

      return reject({
        status: "error",
        message: "Create product failed",
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
        allowedSorts: ["created_at", "price", "sold", "rating", "name"],
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

// const updateProduct = (currentUser, productId, productData) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (Number(currentUser.role) !== 1 || Number(currentUser.role) !== 2) {
//         return reject({
//           statusCode: 403,
//           message: "Forbidden",
//           error: "You do not have permission to update product",
//           data: null,
//         });
//       }

//       const product = await Product.findOne({ where: { id: productId } });

//       if (!product) {
//         return reject({
//           statusCode: 404,
//           message: "Product not found",
//           error: "No product found with the provided ID",
//           data: null,
//         });
//       }

//       const updateData = {
//         updated_at: new Date(),
//         updated_by: currentUser.id,
//         name: productData.name !== undefined ? productData.name : product.name,
//         description:
//           productData.description !== undefined
//             ? productData.description
//             : product.description,
//         price:
//           productData.price !== undefined ? productData.price : product.price,
//         gender:
//           productData.gender !== undefined
//             ? productData.gender
//             : product.gender,
//         sold: productData.sold !== undefined ? productData.sold : product.sold,
//         rating: product.rating || 0,
//         status:
//           productData.status !== undefined
//             ? productData.status
//             : product.status,
//         thumbnail:
//           productData.thumbnail !== undefined
//             ? productData.thumbnail
//             : product.thumbnail,
//         slider:
//           productData.slider !== undefined
//             ? productData.slider
//             : product.slider,
//         category_id:
//           productData.category_id !== undefined
//             ? productData.category_id
//             : product.category_id,
//         brand_id:
//           productData.brand_id !== undefined
//             ? productData.brand_id
//             : product.brand_id,
//       };

//       const updatedProduct = await product.update(updateData);
//       await syncSingleProduct(product);

//       const { brand_id, category_id, ...sanitizedProduct } =
//         updatedProduct.toJSON();
//       return resolve({
//         status: "success",
//         message: "Update product successfully",
//         error: null,
//         data: sanitizedProduct,
//       });
//     } catch (error) {
//       console.log(error);
//       reject({
//         status: "error",
//         message: "Update product fail",
//         error: error.message,
//         data: null,
//       });
//     }
//   });
// };

const updateProduct = (currentUser, productId, productData) => {
  return new Promise(async (resolve, reject) => {
    const transaction = await sequelize.transaction();

    try {
      // Fix permission check logic
      if (Number(currentUser.role) !== 1 && Number(currentUser.role) !== 2) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update product",
          data: null,
        });
      }

      const product = await Product.findOne({
        where: { id: productId },
        transaction,
      });

      if (!product) {
        await transaction.rollback();
        return reject({
          statusCode: 404,
          message: "Product not found",
          error: "No product found with the provided ID",
          data: null,
        });
      }

      //Update basic product information (giữ nguyên logic cũ)
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

      const updatedProduct = await product.update(updateData, { transaction });

      //Handle variants update (THÊM MỚI)
      let variantChanges = null; // Initialize variantChanges outside the if block

      if (productData.variants && Array.isArray(productData.variants)) {
        // Collect unique colors and sizes
        const uniqueColors = new Set();
        const uniqueSizes = new Set();

        productData.variants.forEach((variant) => {
          uniqueColors.add(variant.colorId); // hex_code
          uniqueSizes.add(variant.sizeId); // size name
        });

        // Create maps for color and size IDs
        const colorMap = new Map();
        const sizeMap = new Map();

        // Process Colors - find or create by hex_code
        for (const hexCode of uniqueColors) {
          try {
            let color = await Color.findOne({
              where: { hex_code: hexCode },
              transaction,
            });

            if (!color) {
              // Create new color with default name
              const colorName =
                hexCode === "#000000"
                  ? "Black"
                  : hexCode === "#FFFFFF"
                  ? "White"
                  : hexCode === "#FF0000"
                  ? "Red"
                  : hexCode === "#00FF00"
                  ? "Green"
                  : hexCode === "#0000FF"
                  ? "Blue"
                  : hexCode === "#FFFF00"
                  ? "Yellow"
                  : hexCode === "#FF00FF"
                  ? "Magenta"
                  : hexCode === "#00FFFF"
                  ? "Cyan"
                  : `Color ${hexCode}`;

              color = await Color.create(
                {
                  name: colorName,
                  hex_code: hexCode,
                },
                { transaction }
              );
            }

            colorMap.set(hexCode, color.id);
          } catch (error) {
            console.error(`Error processing color ${hexCode}:`, error);
            await transaction.rollback();
            return reject({
              statusCode: 500,
              message: "Error processing colors",
              error: error.message,
              data: null,
            });
          }
        }

        // Process Sizes - find or create by name
        for (const sizeName of uniqueSizes) {
          try {
            let size = await Size.findOne({
              where: { name: sizeName },
              transaction,
            });

            if (!size) {
              size = await Size.create(
                {
                  name: sizeName,
                },
                { transaction }
              );
            }

            sizeMap.set(sizeName, size.id);
          } catch (error) {
            console.error(`Error processing size ${sizeName}:`, error);
            await transaction.rollback();
            return reject({
              statusCode: 500,
              message: "Error processing sizes",
              error: error.message,
              data: null,
            });
          }
        }

        // Get existing variants
        const existingVariants = await ProductVariant.findAll({
          where: { product_id: productId },
          include: [
            { model: Size, as: "size" },
            { model: Color, as: "color" },
          ],
          transaction,
        });

        // Create maps for comparison
        const existingVariantsMap = new Map();
        existingVariants.forEach((variant) => {
          const key = `${variant.color.hex_code}_${variant.size.name}`;
          existingVariantsMap.set(key, variant);
        });

        const newVariantsMap = new Map();
        productData.variants.forEach((variant) => {
          // Use hex_code and size name for consistency
          const key = `${variant.colorId}_${variant.sizeId}`;
          newVariantsMap.set(key, variant);
        });

        // Track changes
        const toUpdate = [];
        const toCreate = [];
        const toDelete = [];

        // Find variants to update or create
        for (const [key, newVariant] of newVariantsMap) {
          if (existingVariantsMap.has(key)) {
            // Variant exists - check if needs update
            const existingVariant = existingVariantsMap.get(key);
            if (existingVariant.quantity !== parseInt(newVariant.stock)) {
              toUpdate.push({
                existing: existingVariant,
                newData: newVariant,
              });
            }
          } else {
            // New variant - need to create
            toCreate.push(newVariant);
          }
        }

        // Find variants to delete
        for (const [key, existingVariant] of existingVariantsMap) {
          if (!newVariantsMap.has(key)) {
            toDelete.push(existingVariant);
          }
        }

        // Execute updates
        for (const updateItem of toUpdate) {
          try {
            await updateItem.existing.update(
              {
                quantity: parseInt(updateItem.newData.stock) || 0,
                updated_by: currentUser.id,
                updated_at: new Date(),
              },
              { transaction }
            );
          } catch (error) {
            console.error(`Error updating variant:`, error);
            await transaction.rollback();
            return reject({
              statusCode: 500,
              message: "Error updating product variants",
              error: error.message,
              data: null,
            });
          }
        }

        // Execute creates
        for (const newVariant of toCreate) {
          const colorId = colorMap.get(newVariant.colorId);
          const sizeId = sizeMap.get(newVariant.sizeId);

          if (!colorId || !sizeId) {
            await transaction.rollback();
            return reject({
              statusCode: 400,
              message: "Invalid variant data",
              error: `Color ${newVariant.colorId} or Size ${newVariant.sizeId} not found`,
              data: null,
            });
          }

          try {
            await ProductVariant.create(
              {
                product_id: productId,
                size_id: sizeId,
                color_id: colorId,
                quantity: parseInt(newVariant.stock) || 0,
                active: true,
                created_by: currentUser.id,
                updated_by: currentUser.id,
                created_at: new Date(),
                updated_at: new Date(),
              },
              { transaction }
            );
          } catch (error) {
            console.error(`Error creating variant:`, error);
            await transaction.rollback();
            return reject({
              statusCode: 500,
              message: "Error creating product variants",
              error: error.message,
              data: null,
            });
          }
        }

        let actuallyDeleted = 0;
        let actuallyDeactivated = 0;

        for (const variantToDelete of toDelete) {
          try {
            const cartCount = await Cart.count({
              where: { product_variant_id: variantToDelete.id },
              transaction,
            });

            const orderCount = await OrderDetail.count({
              where: { product_variant_id: variantToDelete.id },
              transaction,
            });

            if (cartCount > 0 || orderCount > 0) {
              // Cannot delete - variant is being used
              // Option 1: Set active = false (soft delete)
              await variantToDelete.update(
                {
                  active: false,
                  quantity: 0,
                  updated_by: currentUser.id,
                  updated_at: new Date(),
                },
                { transaction }
              );
              actuallyDeactivated++;
            } else {
              await variantToDelete.destroy({ transaction });
              actuallyDeleted++;
            }
          } catch (error) {
            console.error(`Error deleting variant:`, error);
            await transaction.rollback();
            return reject({
              statusCode: 500,
              message: "Error deleting product variants",
              error: error.message,
              data: null,
            });
          }
        }

        variantChanges = {
          updated: toUpdate.length,
          created: toCreate.length,
          deleted: actuallyDeleted,
          deactivated: actuallyDeactivated,
        };
      }

      await transaction.commit();

      try {
        await syncSingleProduct(updatedProduct);
      } catch (syncError) {
        console.warn("Sync error (non-critical):", syncError);
      }

      const { brand_id, category_id, ...sanitizedProduct } =
        updatedProduct.toJSON();

      const responseData = { ...sanitizedProduct };
      if (productData.variants && variantChanges) {
        responseData.variantChanges = variantChanges;
      }

      return resolve({
        status: "success",
        message: "Update product successfully",
        error: null,
        data: responseData,
      });
    } catch (error) {
      await transaction.rollback();
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
