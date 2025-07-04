const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

const updateUserValidator = validate(
  checkSchema({
    full_name: {
      optional: true,
      isString: {
        errorMessage: "Full name must be a string",
      },
      isLength: {
        options: { min: 6 },
        errorMessage: "Full name must be at least 6 characters long",
      },
    },
    phone: {
      optional: true,
      isMobilePhone: {
        options: ["vi-VN"],
        errorMessage: "Invalid Vietnamese phone number",
      },
    },
    avatar: {
      optional: true,
      isString: {
        errorMessage: "Avatar must be a string",
      },
    },
    birthday: {
      optional: true,
      isISO8601: {
        errorMessage: "Birthday must be a valid ISO8601 date format",
      },
    },
    gender: {
      optional: true,
      isIn: {
        options: [["MALE", "FEMALE", "OTHER"]],
        errorMessage: "Gender must be one of: MALE, FEMALE, OTHER",
      },
    },
    active: {
      optional: true,
      isBoolean: {
        errorMessage: "Active must be a boolean value (true or false)",
      },
    },
  })
);

module.exports = {
  updateUserValidator,
};
