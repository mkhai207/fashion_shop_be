const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

const createColorValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Color name is required",
      },
      isString: {
        errorMessage: "Color name must be a string",
      },
    },
    hex_code: {
      notEmpty: {
        errorMessage: "Hex code is required",
      },
      isString: {
        errorMessage: "Hex code must be a string",
      },
    },
  })
);

const updateColorValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Color name is required",
      },
      isString: {
        errorMessage: "Color name must be a string",
      },
    },

    hex_code: {
      optional: true,
      notEmpty: {
        errorMessage: "Hex code is required",
      },
      isString: {
        errorMessage: "Hex code must be a string",
      },
    },
  })
);

module.exports = {
  createColorValidator,
  updateColorValidator,
};
