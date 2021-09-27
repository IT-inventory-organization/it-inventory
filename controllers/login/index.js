const { Op } = require("sequelize");
const { body } = require("express-validator");
const { generateToken } = require("../../helper/jwt");
const ErrorValidation = require("../../middlewares/ErrorValidation");
const { checkHashText, createHashText } = require("../../helper/bcrypt");
const User = require("../../database/models/user");
const sequelize = require("../../configs/database");
const { DataTypes } = require("sequelize");

const validationBody = [
  body("email").isLength({ min: 1 }).withMessage("A email is required"),
  body("password").isLength({ min: 1 }).withMessage("A password is required"),
];

module.exports = (router) => {
  router.post("/", validationBody, ErrorValidation, async (req, res) => {
    // Params for generateToken()
    const body = {
      email: req.body.email,
      password: req.body.password,
    };

    const user = User(sequelize, DataTypes);
    try {
      const getUser = await user.findOne({
        where: {
          [Op.or]: [
            { email: req.body.email },
            { npwp: req.body.email },
            { username: req.body.email },
          ],
        },
      });

      // if username, email and npwp don't exist
      if (!getUser) {
        return res.status(404).json({
          status: false,
          message: "Login failed, please check email or password!",
          data: [],
        });
      }

      const result = getUser.toJSON();
      const checkPassword = checkHashText(result.password, req.body.password);
      if (checkPassword) {
        const payload = {
          token: generateToken({ email: result.email, user_id: result.id }),
          success: true,
          message: "Login successfully!",
        };
        res.status(200).json(payload);
      } else {
        return res.status(401).json({
          status: false,
          message: "Login failed, please check email or password!",
          data: [],
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message, status: false, data: [] });
    }
  });
};
