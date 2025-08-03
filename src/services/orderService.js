const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const User = db.User;
const ProductVariant = db.ProductVariant;
const Discount = db.Discount;
const Order = db.Order;
const OrderDetail = db.OrderDetail;
const Product = db.Product;
const Color = db.Color;
const Size = db.Size;
const sequelize = db.sequelize;
const paymentService = require("./paymentService");
const { syncSingleProduct } = require("./productService");

// const createOrder = (currentUser, orderData, ipAddr = "127.0.0.1") => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const {
//         status,
//         paymentMethod,
//         orderDetails,
//         user,
//         shipping_address,
//         name,
//         phone,
//         discount_code,
//       } = orderData;

//       const isAdmin = Number(currentUser.role) === 1;
//       const isStaff = Number(currentUser.role) === 2;
//       const targetUserId = isAdmin && user?.id ? user.id : currentUser.id;

//       if ((isAdmin || isStaff) && user?.id) {
//         const userExists = await User.findByPk(user.id);
//         if (!userExists) throw new Error("User not found");
//       }

//       if (
//         !orderDetails ||
//         !Array.isArray(orderDetails) ||
//         !orderDetails.length
//       ) {
//         throw new Error("orderDetails must be a non-empty array");
//       }

//       const orderItemsData = await Promise.all(
//         orderDetails.map(async ({ product_variant_id, quantity }) => {
//           const variant = await ProductVariant.findByPk(product_variant_id, {
//             include: [
//               {
//                 model: Product,
//                 as: "product",
//                 attributes: ["id", "name", "price"],
//               },
//             ],
//           });
//           if (!variant)
//             throw new Error(`Product variant ${product_variant_id} not found`);
//           if (quantity <= 0 || !Number.isInteger(quantity))
//             throw new Error(
//               `Invalid quantity for product variant ${product_variant_id}`
//             );
//           if (quantity > variant.quantity)
//             throw new Error(
//               `Insufficient stock for product variant ${product_variant_id}`
//             );
//           return { product_variant_id, quantity, price: variant.product.price };
//         })
//       );

//       let total_money = orderItemsData.reduce(
//         (sum, item) => sum + item.quantity * item.price,
//         0
//       );

//       let discount_id = null;
//       if (discount_code) {
//         const discount = await Discount.findOne({
//           where: { code: discount_code },
//         });
//         if (
//           !discount ||
//           discount.valid_until < new Date() ||
//           discount.valid_from > new Date()
//         ) {
//           throw new Error("Invalid or expired discount code");
//         }
//         if (total_money < discount.minimum_order_value) {
//           throw new Error(
//             `Order value must be at least ${discount.minimum_order_value} to apply this discount`
//           );
//         }
//         let discount_amount = 0;
//         if (discount.discount_type === "PERCENTAGE") {
//           discount_amount = total_money * (discount.discount_value / 100);
//         } else if (discount.discount_type === "FIXED") {
//           discount_amount = discount.discount_value;
//         }
//         if (
//           discount.max_discount_amount &&
//           discount_amount > discount.max_discount_amount
//         ) {
//           discount_amount = discount.max_discount_amount;
//         }
//         total_money -= discount_amount;
//         discount_id = discount.id;
//       }

//       const validStatus = isAdmin
//         ? status
//         : paymentMethod === "CASH"
//         ? "PENDING"
//         : "UNPAID";

//       if (
//         ![
//           "PENDING",
//           "UNPAID",
//           "PAID",
//           "SHIPPING",
//           "COMPLETED",
//           "CANCELED",
//         ].includes(validStatus)
//       ) {
//         throw new Error("Invalid status");
//       }

//       const date = new Date();
//       const t = await sequelize.transaction();
//       try {
//         const order = await Order.create(
//           {
//             user_id: targetUserId,
//             name,
//             phone,
//             shipping_address,
//             payment_method: paymentMethod,
//             total_money,
//             discount_id,
//             status: validStatus,
//             created_at: date,
//             created_by: currentUser.id,
//             updated_at: date,
//             updated_by: currentUser.id,
//             transaction_id: null,
//           },
//           { transaction: t }
//         );

//         const orderItems = orderItemsData.map((item) => ({
//           order_id: order.id,
//           product_variant_id: item.product_variant_id,
//           quantity: item.quantity,
//           price: item.price,
//           created_at: date,
//           created_by: currentUser.id,
//           updated_at: date,
//           updated_by: currentUser.id,
//         }));
//         await OrderDetail.bulkCreate(orderItems, { transaction: t });

//         if (paymentMethod === "ONLINE") {
//           const vnpayUrl = await paymentService.createVNPayUrl(
//             order,
//             total_money,
//             ipAddr
//           );
//           await t.commit();
//           resolve({
//             status: "success",
//             message: "Order created, redirect to VNPAY",
//             error: null,
//             data: { order, orderItems, vnpayUrl },
//           });
//         } else {
//           const updatePromises = orderItemsData.map((item) =>
//             ProductVariant.update(
//               { quantity: sequelize.literal(`quantity - ${item.quantity}`) },
//               { where: { id: item.product_variant_id }, transaction: t }
//             )
//           );
//           await Promise.all(updatePromises);
//           await t.commit();
//           resolve({
//             status: "success",
//             message: "Create order successfully",
//             error: null,
//             data: { order, orderItems },
//           });
//         }
//       } catch (error) {
//         await t.rollback();
//         throw error;
//       }
//     } catch (error) {
//       console.log(error);
//       reject({
//         status: "error",
//         message: "Create order fail",
//         error: error.message,
//         data: null,
//       });
//     }
//   });
// };

const createOrder = (currentUser, orderData, ipAddr = "127.0.0.1") => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        status,
        paymentMethod,
        orderDetails,
        user,
        shipping_address,
        name,
        phone,
        discount_code,
      } = orderData;

      const isAdmin = Number(currentUser.role) === 1;
      const isStaff = Number(currentUser.role) === 2;
      const targetUserId = isAdmin && user?.id ? user.id : currentUser.id;

      if ((isAdmin || isStaff) && user?.id) {
        const userExists = await User.findByPk(user.id);
        if (!userExists) throw new Error("User not found");
      }

      if (
        !orderDetails ||
        !Array.isArray(orderDetails) ||
        !orderDetails.length
      ) {
        throw new Error("orderDetails must be a non-empty array");
      }

      const orderItemsData = await Promise.all(
        orderDetails.map(async ({ product_variant_id, quantity }) => {
          const variant = await ProductVariant.findByPk(product_variant_id, {
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "price"],
              },
            ],
          });
          if (!variant)
            throw new Error(`Product variant ${product_variant_id} not found`);
          if (quantity <= 0 || !Number.isInteger(quantity))
            throw new Error(
              `Invalid quantity for product variant ${product_variant_id}`
            );
          if (quantity > variant.quantity)
            throw new Error(
              `Insufficient stock for product variant ${product_variant_id}`
            );
          return {
            product_variant_id,
            quantity,
            price: variant.product.price,
            product_id: variant.product.id, // Thêm product_id để cập nhật sold
          };
        })
      );

      let total_money = orderItemsData.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      let discount_id = null;
      if (discount_code) {
        const discount = await Discount.findOne({
          where: { code: discount_code },
        });
        if (
          !discount ||
          discount.valid_until < new Date() ||
          discount.valid_from > new Date()
        ) {
          throw new Error("Invalid or expired discount code");
        }
        if (total_money < discount.minimum_order_value) {
          throw new Error(
            `Order value must be at least ${discount.minimum_order_value} to apply this discount`
          );
        }
        let discount_amount = 0;
        if (discount.discount_type === "PERCENTAGE") {
          discount_amount = total_money * (discount.discount_value / 100);
        } else if (discount.discount_type === "FIXED") {
          discount_amount = discount.discount_value;
        }
        if (
          discount.max_discount_amount &&
          discount_amount > discount.max_discount_amount
        ) {
          discount_amount = discount.max_discount_amount;
        }
        total_money -= discount_amount;
        discount_id = discount.id;
      }

      const validStatus = isAdmin
        ? status
        : paymentMethod === "CASH"
        ? "PENDING"
        : "UNPAID";

      if (
        ![
          "PENDING",
          "UNPAID",
          "PAID",
          "SHIPPING",
          "COMPLETED",
          "CANCELED",
        ].includes(validStatus)
      ) {
        throw new Error("Invalid status");
      }

      const date = new Date();
      const t = await sequelize.transaction();
      try {
        const order = await Order.create(
          {
            user_id: targetUserId,
            name,
            phone,
            shipping_address,
            payment_method: paymentMethod,
            total_money,
            discount_id,
            status: validStatus,
            created_at: date,
            created_by: currentUser.id,
            updated_at: date,
            updated_by: currentUser.id,
            transaction_id: null,
          },
          { transaction: t }
        );

        const orderItems = orderItemsData.map((item) => ({
          order_id: order.id,
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          price: item.price,
          created_at: date,
          created_by: currentUser.id,
          updated_at: date,
          updated_by: currentUser.id,
        }));
        await OrderDetail.bulkCreate(orderItems, { transaction: t });

        // Cập nhật quantity trong ProductVariant cho cả 2 trường hợp
        const updateVariantPromises = orderItemsData.map((item) =>
          ProductVariant.update(
            { quantity: sequelize.literal(`quantity - ${item.quantity}`) },
            { where: { id: item.product_variant_id }, transaction: t }
          )
        );

        const productSoldMap = {};
        orderItemsData.forEach((item) => {
          if (productSoldMap[item.product_id]) {
            productSoldMap[item.product_id] += item.quantity;
          } else {
            productSoldMap[item.product_id] = item.quantity;
          }
        });

        const updateProductPromises = Object.entries(productSoldMap).map(
          ([productId, soldQuantity]) =>
            Product.update(
              { sold: sequelize.literal(`sold + ${soldQuantity}`) },
              { where: { id: productId }, transaction: t }
            )
        );

        await Promise.all([...updateVariantPromises, ...updateProductPromises]);

        await t.commit();

        try {
          const updatedProductIds = Object.keys(productSoldMap);
          const syncPromises = updatedProductIds.map(async (productId) => {
            const updatedProduct = await Product.findByPk(productId);
            if (updatedProduct) {
              await syncSingleProduct(updatedProduct);
            }
          });

          await Promise.all(syncPromises);
          console.log("Successfully synced products to Elasticsearch");
        } catch (syncError) {
          console.error("Error syncing products to Elasticsearch:", syncError);
        }

        if (paymentMethod === "ONLINE") {
          const vnpayUrl = await paymentService.createVNPayUrl(
            order,
            total_money,
            ipAddr
          );
          resolve({
            status: "success",
            message: "Order created, redirect to VNPAY",
            error: null,
            data: { order, orderItems, vnpayUrl },
          });
        } else {
          resolve({
            status: "success",
            message: "Create order successfully",
            error: null,
            data: { order, orderItems },
          });
        }
      } catch (error) {
        await t.rollback();
        throw error;
      }
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Create order fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const retryPayment = (currentUser, orderId, ipAddr = "127.0.0.1") => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderDetail, as: "orderDetails" }],
      });
      if (!order) throw new Error("Order not found");
      if (order.user_id !== currentUser.id && Number(currentUser.role) !== 1) {
        throw new Error("Unauthorized to retry payment for this order");
      }
      if (order.payment_method !== "ONLINE" || order.status !== "UNPAID") {
        throw new Error("Order is not eligible for retry payment");
      }

      const orderItems = order.orderDetails;
      await Promise.all(
        orderItems.map(async (item) => {
          const variant = await ProductVariant.findByPk(
            item.product_variant_id
          );
          if (!variant)
            throw new Error(
              `Product variant ${item.product_variant_id} not found`
            );
          if (item.quantity > variant.quantity)
            throw new Error(
              `Insufficient stock for product variant ${item.product_variant_id}`
            );
        })
      );

      const vnpayUrl = await paymentService.createVNPayUrl(
        order,
        order.total_money,
        ipAddr
      );
      console.log("Generated VNPay URL:", vnpayUrl);
      resolve({
        status: "success",
        message: "Retry payment URL generated",
        error: null,
        data: { order, vnpayUrl },
      });
    } catch (error) {
      console.error("Error in retryPayment:", error.stack);
      reject({
        status: "error",
        message: "Failed to generate retry payment URL",
        error: error.message,
        data: null,
      });
    }
  });
};

const getOrders = (currentUser, query) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isCustomer = Number(currentUser.role) === 3;
      if (isCustomer) {
        query.user_id = currentUser.id;
      }

      const result = await buildQuery(Order, query, {
        attributes: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "name",
          "payment_method",
          "phone",
          "shipping_address",
          "status",
          "total_money",
          "discount_id",
          "user_id",
        ],
        allowedFilters: [
          "created_at",
          "created_by",
          "phone",
          "status",
          "user_id",
        ],
        allowedSorts: ["created_at", "name"],
        defaultSort: [["created_at", "DESC"]],
        defaultLimit: 20,
      });

      resolve(result);
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get order fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getOrderById = (currentUser, orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isCustomer = Number(currentUser.role) === 3;

      const order = await Order.findOne({
        where: {
          id: orderId,
        },
        include: [
          {
            model: OrderDetail,
            as: "orderDetails",
            include: [
              {
                model: ProductVariant,
                as: "variant",
                include: [
                  { model: Product, as: "product" },
                  { model: Color, as: "color" },
                  { model: Size, as: "size" },
                ],
              },
            ],
          },
          {
            model: Discount,
            as: "discount",
          },
        ],
      });
      if (!order) {
        return reject({
          statusCode: 404,
          message: "Order not found",
          error: null,
          data: null,
        });
      }

      if (isCustomer && order.user_id !== currentUser.id) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to access this order",
          data: null,
        });
      }

      return resolve({
        status: "success",
        message: "Get order successfully",
        error: null,
        data: order,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get order fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateOrderStatus = (currentUser, orderId, newStatus) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Order.update(
        { status: newStatus, updated_by: currentUser.id },
        { where: { id: orderId } }
      );

      const updatedOrder = await Order.findByPk(orderId, {
        include: [{ model: OrderDetail, as: "orderDetails" }],
      });

      return resolve({
        status: "success",
        message: "Update status successfully",
        error: null,
        data: updatedOrder,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Update status fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  createOrder,
  retryPayment,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
