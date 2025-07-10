const { checkSchema } = require("express-validator");
const validate = require("../utils/validation");

const uploadSingleImageValidator = validate(
  checkSchema({
    image: {
      custom: {
        options: (value, { req }) => {
          if (!req.file) {
            throw new Error("Image file is required");
          }
          return true;
        },
      },
    },
  })
);

const uploadMultipleImagesValidator = validate(
  checkSchema({
    images: {
      custom: {
        options: (value, { req }) => {
          if (!req.files || req.files.length === 0) {
            throw new Error("At least one image file is required");
          }
          if (req.files.length > 10) {
            throw new Error("Cannot upload more than 10 images");
          }
          return true;
        },
      },
    },
  })
);

module.exports = {
  uploadSingleImageValidator,
  uploadMultipleImagesValidator,
};
