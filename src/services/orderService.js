const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const { Sequelize } = require("sequelize");
const User = db.User;
const ProductVariant = db.ProductVariant;
const Discount = db.Discount;
const Order = db.Order;
const OrderDetail = db.OrderDetail;
const Product = db.Product;

const createOrder = (currentUser, orderData) => {
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
      const targetUserId = isAdmin && user?.id ? user.id : currentUser.id;

      if (isAdmin && user?.id) {
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
          return { product_variant_id, quantity, price: variant.product.price };
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
        if (!discount || discount.valid_until < new Date()) {
          throw new Error("Invalid or expired discount code");
        }
        if (total_money < discount.minimum_order_value) {
          throw new Error(
            `Order value must be at least ${discount.minimum_order_value} to apply this discount`
          );
        }
        let discount_amount = total_money * (discount.percentage / 100);
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
      const order = await Order.create({
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
      });

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
      await OrderDetail.bulkCreate(orderItems);

      const updatePromises = orderItemsData.map((item) => {
        return ProductVariant.update(
          {
            quantity: Sequelize.literal(`quantity - ${item.quantity}`),
          },
          {
            where: { id: item.product_variant_id },
          }
        );
      });

      await Promise.all(updatePromises);

      return resolve({
        status: "success",
        message: "Create order successfully",
        error: null,
        data: { order, orderItems },
      });
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

// const getAllCarts = (query) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const result = await buildQuery(Cart, query, {
//         attributes: [
//           "id",
//           "created_at",
//           "created_by",
//           "updated_at",
//           "updated_by",
//           "product_variant_id",
//           "quantity",
//           "user_id",
//         ],
//         allowedFilters: [
//           "id",
//           "created_at",
//           "created_by",
//           "updated_at",
//           "updated_by",
//           "product_variant_id",
//           "quantity",
//           "user_id",
//         ],
//         allowedSorts: ["created_at", "updated_at", "quantity"],
//         defaultSort: [["created_at", "DESC"]],
//         defaultLimit: 20,
//         include: [
//           {
//             model: ProductVariant,
//             as: "variant",
//             include: [
//               {
//                 model: Product,
//                 as: "product",
//                 attributes: ["id", "name", "price"],
//               },
//               { model: Size, as: "size", attributes: ["id", "name"] },
//               {
//                 model: Color,
//                 as: "color",
//                 attributes: ["id", "name", "hex_code"],
//               },
//             ],
//           },
//         ],
//       });

//       resolve(result);
//     } catch (error) {
//       console.log(error);
//       reject({
//         status: "error",
//         message: "Get variant fail",
//         error: error.message,
//         data: null,
//       });
//     }
//   });
// };

// const updateCart = (currentUser, cartId, cartData) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const cart = await Cart.findOne({
//         where: { id: cartId },
//       });

//       if (!cart) {
//         return reject({
//           statusCode: 404,
//           message: "cart not found",
//           error: "No cart found with the provided ID",
//           data: null,
//         });
//       }

//       const isOwner = Number(currentUser.id) === Number(cart.user_id);

//       if (!isOwner) {
//         return reject({
//           statusCode: 403,
//           message: "Forbidden",
//           error: "You do not have permission to update cart",
//           data: null,
//         });
//       }

//       const updateData = {
//         updated_at: new Date(),
//         updated_by: currentUser.id,
//         product_variant_id:
//           cartData.product_variant_id !== undefined
//             ? cartData.product_variant_id
//             : cart.product_variant_id,
//         quantity:
//           cartData.quantity !== undefined ? cartData.quantity : cart.quantity,
//       };

//       const updatedCart = await cart.update(updateData);

//       const cartDetail = await Cart.findByPk(cart.id, {
//         include: [
//           {
//             model: ProductVariant,
//             as: "variant",
//             include: [
//               {
//                 model: Product,
//                 as: "product",
//                 attributes: ["id", "name", "price"],
//               },
//               { model: Size, as: "size", attributes: ["id", "name"] },
//               {
//                 model: Color,
//                 as: "color",
//                 attributes: ["id", "name", "hex_code"],
//               },
//             ],
//           },
//         ],
//       });

//       return resolve({
//         status: "success",
//         message: "Update cart successfully",
//         error: null,
//         data: cartDetail,
//       });
//     } catch (error) {
//       console.log(error);
//       reject({
//         status: "error",
//         message: "Update cart fail",
//         error: error.message,
//         data: null,
//       });
//     }
//   });
// };

// const deleteCartById = (currentUser, cartId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const cart = await Cart.findOne({
//         where: { id: cartId },
//       });

//       if (!cart) {
//         return reject({
//           statusCode: 404,
//           message: "cart not found",
//           error: "No cart found with the provided ID",
//           data: null,
//         });
//       }

//       const isOwner = Number(currentUser.id) === Number(cart.user_id);

//       if (!isOwner) {
//         return reject({
//           statusCode: 403,
//           message: "Forbidden",
//           error: "You do not have permission to delete cart",
//           data: null,
//         });
//       }

//       await cart.destroy();

//       return resolve({
//         status: "success",
//         message: "Delete variant successfully",
//         error: null,
//         data: null,
//       });
//     } catch (error) {
//       console.log(error);
//       reject({
//         status: "error",
//         message: "Delete cart fail",
//         error: error.message,
//         data: null,
//       });
//     }
//   });
// };

// const deleteMultiCartItems = (currentUser, cartIds) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const cartItems = await Cart.findAll({
//         where: { id: cartIds, user_id: currentUser.id },
//       });

//       if (cartItems.length !== cartIds.length) {
//         return reject({
//           statusCode: 404,
//           message: "Cart not found",
//           error: "Some cart items do not exist",
//           data: null,
//         });
//       }
//       await Cart.destroy({ where: { id: cartIds } });

//       return resolve({
//         status: "success",
//         message: "Delete cart items successfully",
//         error: null,
//         data: null,
//       });
//     } catch (error) {
//       console.log(error);
//       reject({
//         status: "error",
//         message: "Delete cart items fail",
//         error: error.message,
//         data: null,
//       });
//     }
//   });
// };

module.exports = {
  createOrder,
};
