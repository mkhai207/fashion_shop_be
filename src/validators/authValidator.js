const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

const registerValidator = validate(
  checkSchema({
    fullName: {
      notEmpty: {
        errorMessage: "Full name cannot be empty",
      },
      isLength: {
        options: { min: 6 },
        errorMessage: "Full name must be at least 6 characters long",
      },
    },
    phone: {
      notEmpty: {
        errorMessage: "Phone number cannot be empty",
      },
      isMobilePhone: {
        options: ["vi-VN"],
        errorMessage: "Invalid phone number",
      },
    },
    email: {
      notEmpty: {
        errorMessage: "Email cannot be empty",
      },
      isEmail: {
        errorMessage: "Invalid email address",
      },
      normalizeEmail: true,
    },
    password: {
      notEmpty: {
        errorMessage: "Password cannot be empty",
      },
      isLength: {
        options: { min: 6 },
        errorMessage: "Password must be at least 6 characters long",
      },
    },
    confirmPassword: {
      notEmpty: {
        errorMessage: "Confirm password cannot be empty",
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Confirm password does not match");
          }
          return true;
        },
      },
    },
  })
);

const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: "Email cannot be empty",
      },
      isEmail: {
        errorMessage: "Invalid email address",
      },
      normalizeEmail: true,
    },
    password: {
      notEmpty: {
        errorMessage: "Password cannot be empty",
      },
      isLength: {
        options: { min: 6 },
        errorMessage: "Password must be at least 6 characters long",
      },
    },
  })
);

const refreshValidator = validate(
  checkSchema({
    refreshToken: {
      notEmpty: {
        errorMessage: "Refresh token cannot be empty",
      },
      isString: {
        errorMessage: "Refresh token must be a string",
      },
    },
  })
);

module.exports = {
  registerValidator,
  loginValidator,
  refreshValidator,
};
