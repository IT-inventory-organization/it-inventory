const { Op } = require("sequelize");
const { body, validationResult } = require("express-validator");
const { generateToken } = require("../../helper/jwt");

const validationBody = [body("email").notEmpty(), body("password").notEmpty()];

module.exports = (router) => {
  router.post("/", validationBody, (req, res) => {
    // Validation body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
