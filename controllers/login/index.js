const { Op } = require("sequelize");
const { body, validationResult } = require("express-validator");
const { generateToken } = require("../../helper/jwt");
const ErrorValidation = require("../../middlewares/ErrorValidation");

const validationBody = [
  body("email").isLength({ min: 1 }).withMessage("A email is required"),
  body("password").isLength({ min: 1 }).withMessage("A password is required"),
];

module.exports = (router) => {
  router.post("/", validationBody, ErrorValidation, (req, res) => {
    // Params for generateToken()
    const body = {
      email: req.body.email,
      password: req.body.password,
    };

    // result
    const payload = {
      token: generateToken(body),
    };

    res.status(200).json(payload);
  });
};
