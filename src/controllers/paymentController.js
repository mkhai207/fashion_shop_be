require("dotenv").config();
const db = require("../../models");

const sequelize = db.sequelize;
const Order = db.Order;
const OrderDetail = db.OrderDetail;
const ProductVariant = db.ProductVariant;
const crypto = require("crypto");

const handleVNPayReturn = async (req, res) => {
  try {
    const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
    const vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = vnp_Params[key];
        return obj;
      }, {});
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const checkSum = hmac.update(signData).digest("hex");

    if (secureHash !== checkSum) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid checksum" });
    }

    const orderId = vnp_Params["vnp_TxnRef"].split("_")[1];
    const vnp_ResponseCode = vnp_Params["vnp_ResponseCode"];
    const transactionId = vnp_Params["vnp_TransactionNo"];

    const t = await sequelize.transaction();
    try {
      const order = await Order.findByPk(orderId, { transaction: t });
      if (!order) {
        await t.rollback();
        return res
          .status(404)
          .json({ status: "error", message: "Order not found" });
      }

      if (vnp_ResponseCode === "00") {
        await order.update(
          { status: "PAID", transaction_id: transactionId },
          { transaction: t }
        );
        const orderItems = await OrderDetail.findAll({
          where: { order_id: orderId },
          transaction: t,
        });
        const updatePromises = orderItems.map((item) =>
          ProductVariant.update(
            { quantity: sequelize.literal(`quantity - ${item.quantity}`) },
            { where: { id: item.product_variant_id }, transaction: t }
          )
        );
        await Promise.all(updatePromises);
        await t.commit();
        return res.redirect("http://your-frontend.com/payment-success");
      } else {
        await t.commit();
        return res.redirect("http://your-frontend.com/payment-retry");
      }
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error in handleVNPayReturn:", error.stack);
    res
      .status(500)
      .json({ status: "error", message: "Failed to process payment callback" });
  }
};

module.exports = { handleVNPayReturn };
