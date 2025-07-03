const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

const registerValidator = validate(
  checkSchema({
    fullName: {
      notEmpty: {
        errorMessage: "Họ tên không được để trống",
      },
      isLength: {
        options: { min: 3 },
        errorMessage: "Họ tên phải có ít nhất 3 ký tự",
      },
    },
    phone: {
      notEmpty: {
        errorMessage: "Số điện thoại không được để trống",
      },
      isMobilePhone: {
        options: ["vi-VN"],
        errorMessage: "Số điện thoại không hợp lệ",
      },
    },
    email: {
      notEmpty: {
        errorMessage: "Email không được để trống",
      },
      isEmail: {
        errorMessage: "Email không hợp lệ",
      },
      normalizeEmail: true,
    },
    password: {
      notEmpty: {
        errorMessage: "Mật khẩu không được để trống",
      },
      isLength: {
        options: { min: 6 },
        errorMessage: "Mật khẩu phải có ít nhất 6 ký tự",
      },
    },
    confirmPassword: {
      notEmpty: {
        errorMessage: "Xác nhận mật khẩu không được để trống",
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Mật khẩu xác nhận không khớp");
          }
          return true;
        },
      },
    },
  })
);

module.exports = registerValidator;
