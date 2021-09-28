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

const loginAction = async (req, res) => {
  try {
    const getUser = await User.findOne({
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
        message: "User not found!",
        data: [],
      });
    }

    const result = getUser.toJSON();

    // Check user is active
    if (!result.is_active) {
      return res.status(401).json({
        status: false,
        message: "User is no longer active!",
        data: [],
      });
    }

    // Check password
    const checkPassword = checkHashText(result.password, req.body.password);
    if (checkPassword) {
      // if the password is correct
      const payload = {
        token: generateToken({ email: result.email, user_id: result.id }),
        success: true,
        message: "Login successfully!",
      };
      res.status(200).json(payload);
    } else {
      // if the password is not correct
      return res.status(401).json({
        status: false,
        message: "Login failed, enter the correct password!",
        data: [],
      });
    }
  } catch (error) {
    // if there is a system error
    return res
      .status(500)
      .json({ message: error.message, status: false, data: [] });
  }
};

module.exports = (router) => {
  router.post("/", validationBody, ErrorValidation, loginAction);
};
