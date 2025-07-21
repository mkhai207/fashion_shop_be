const { WHITELIST_DOMAINS } = require("../src/utils/constants");

const corsOptions = {
  origin: function (origin, callback) {
    // Kiểm tra dem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(
      new Error(
        `CORS error: The origin ${origin} is not allowed by the CORS policy.`
      )
    );
  },

  optionsSuccessStatus: 200,

  credentials: true,
};

module.exports = corsOptions;
