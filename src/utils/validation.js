const express = require("express");
const { validationResult } = require("express-validator");

// can be reused by many routes
const validate = (validations) => {
  return async (req, res, next) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        // return res.status(400).json({ errors: result.mapped() });
        const error = result.array({ onlyFirstError: true })[0];

        return res.status(400).json({
          status: "error",
          message: error.msg,
        });
      }
    }
    next();
  };
};

module.exports = validate;
