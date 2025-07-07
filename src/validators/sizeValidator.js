const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

const createSizeValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Size name is required",
      },
      isString: {
        errorMessage: "Size name must be a string",
      },
    },
  })
);

const updateSizeValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Size name is required",
      },
      isString: {
        errorMessage: "Size name must be a string",
      },
    },
  })
);

module.exports = {
  createSizeValidator,
  updateSizeValidator,
};
