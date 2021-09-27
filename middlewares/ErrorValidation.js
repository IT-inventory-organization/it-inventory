const { validationResult } = require("express-validator");

const ErrorValidation = (req, res, next) => {
  const errors = validationResult(req);

  const dataError = [];

  errors.array().map((val) => {
    dataError.push({ message: val.msg, name: val.param });
  });

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: dataError,
    });
  }

  next();
};

module.exports = ErrorValidation;
