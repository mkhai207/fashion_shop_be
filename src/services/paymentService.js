require("dotenv").config();
const crypto = require("crypto");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

const createVNPayUrl = (order, amount, ipAddr = "127.0.0.1") => {
  const vnp_TmnCode = process.env.VNPAY_TMNCODE;
  const vnp_HashSecret = process.env.VNPAY_HASH_SECRET;
  const vnp_Url = process.env.VNPAY_URL;
  const vnp_ReturnUrl = process.env.VNPAY_RETURN_URL;

  const createDate = dayjs().tz("Asia/Ho_Chi_Minh");
  const expireDate = createDate.add(15, "minute");

  const params = new URLSearchParams();
  params.append("vnp_Version", "2.1.0");
  params.append("vnp_Command", "pay");
  params.append("vnp_TmnCode", vnp_TmnCode);
  params.append("vnp_Amount", String(amount * 100));
  params.append("vnp_CurrCode", "VND");
  params.append("vnp_TxnRef", `ORDER_${order.id}_${Date.now()}`);
  params.append("vnp_OrderInfo", `Thanh toan don hang ${order.id}`);
  params.append("vnp_OrderType", "order-type");
  params.append("vnp_Locale", "vn");
  params.append("vnp_ReturnUrl", vnp_ReturnUrl);
  params.append("vnp_IpAddr", ipAddr);
  params.append("vnp_CreateDate", createDate.format("YYYYMMDDHHmmss"));
  params.append("vnp_ExpireDate", expireDate.format("YYYYMMDDHHmmss"));

  const sortedParams = Array.from(params.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const queryString = sortedParams
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(value).replace(/%20/g, "+")}`
    )
    .join("&");
  console.log("Query String for Checksum:", queryString);

  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const vnp_SecureHash = hmac.update(queryString).digest("hex");
  console.log("Generated vnp_SecureHash:", vnp_SecureHash);
  params.append("vnp_SecureHash", vnp_SecureHash);

  const finalUrl = `${vnp_Url}?${params.toString()}`;
  console.log("Final VNPAY URL:", finalUrl);

  return finalUrl;
};

module.exports = { createVNPayUrl };
