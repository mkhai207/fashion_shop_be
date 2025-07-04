const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

const createCategoryValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Category name is required",
      },
      isString: {
        errorMessage: "Category name must be a string",
      },
    },
    code: {
      notEmpty: {
        errorMessage: "Category code is required",
      },
      isString: {
        errorMessage: "Category code must be a string",
      },
    },
  })
);

const updateCategoryValidator = validate(
  checkSchema({
    name: {
      optional: true,
      isString: {
        errorMessage: "Category name must be a string",
      },
    },
    code: {
      optional: true,
      isString: {
        errorMessage: "Category code must be a string",
      },
    },
  })
);

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};
