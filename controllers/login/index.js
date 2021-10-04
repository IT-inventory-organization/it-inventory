const { Op } = require("sequelize");
const { body, validationResult } = require("express-validator");
const { generateToken } = require("../../helper/jwt");
const { errorResponse, successResponse } = require("../../helper/Response");
const httpStatus = require("../../helper/Httplib")
const { checkHashText } = require("../../helper/bcrypt");
const User = require("../../database/models/user");
const Role = require("../../database/models/role");

const validationBody = [
  body("email").isLength({ min: 1 }).withMessage("Email/Npwp/username is required"),
  body("password").isLength({ min: 1 }).withMessage("A password is required"),
];

const loginAction = async (req, res) => {
  try {
    const validation = validationResult(req);
    
    if(!validation.isEmpty()){
        return errorResponse(res, httpStatus.badRequest, validation.array()[0].msg);
    }
    
    const getUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { npwp: req.body.email },
          { username: req.body.email },
        ],
        is_active: true
      }
    });
    console.info(getUser)

    // if username, email and npwp don't exist
    if (!getUser) {
      return errorResponse(res, httpStatus.notFound, "User not found!")
    }
    console.info(getUser)
    const result = getUser.toJSON();

    // Check password
    if (checkHashText(result.password, req.body.password)) {
      // if the password is correct
      const token = generateToken({ email: result.email, user_id: result.id })
      return res.status(httpStatus.ok).json({success: true, message: "Success login", data: token})
    } else {
      // if the password is not correct
      return errorResponse(res, httpStatus.unauthenticated, "Login failed, enter the correct password!")
    }
  } catch (error) {
    // if there is a system error
    return errorResponse(res, httpStatus.internalServerError, error.message)
  }
};

module.exports = (router) => {
  router.post("/", validationBody, loginAction);
};
