const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

const createBrandValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: "Brand name is required",
      },
      isString: {
        errorMessage: "Brand name must be a string",
      },
    },
  })
);

const updateBrandValidator = validate(
  checkSchema({
    name: {
      optional: true,
      isString: {
        errorMessage: "Brand name must be a string",
      },
    },
  })
);

module.exports = {
  createBrandValidator,
  updateBrandValidator,
};
