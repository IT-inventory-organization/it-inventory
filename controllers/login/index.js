const { Op } = require("sequelize");
const { body, validationResult } = require("express-validator");
const { generateToken } = require("../../helper/jwt");
const { errorResponse, successResponse } = require("../../helper/Response");
const httpStatus = require("../../helper/Httplib");
const { checkHashText } = require("../../helper/bcrypt");
const User = require("../../database/models/user");
const Role = require("../../database/models/role");
const Encryption = require("../../helper/encription");
const UserPrivilages = require("../../database/models/userPrivilages");
const { AESEncrypt } = require("../../helper/encription");
const { ConvertPermission } = require("../../helper/permissionConvert");

const validationBody = [
  body("DataToInput.email")
    .isLength({ min: 1 })
    .withMessage("Email/Npwp/username is required"),
  body("DataToInput.password")
    .isLength({ min: 1 })
    .withMessage("A password is required"),
];

const getUserData = async (email) => {
  try {
    return await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { npwp: email }, { username: email }],
        is_active: true,
      },
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
        {
          model: UserPrivilages,
          required: false,
          where: { isDelete: false },
          attributes: {
            exclude: ["createdAt", "updatedAt", "isDelete", "id", "userId"],
          },
        },
      ],
    });
  } catch (error) {
    throw error;
  }
};

const checkBody = (email, password, res) => {
  if (typeof email === "undefined" || email.length == 0) {
    return errorResponse(
      res,
      httpStatus.badRequest,
      "Email / Npwp / Username is required"
    );
  }
  if (typeof password === "undefined" || password.length == 0) {
    return errorResponse(res, httpStatus.badRequest, "A Password Is Required");
  }
};
const loginAction = async (req, res) => {
  try {
    const Decrpypt = Encryption.AESDecrypt(req.body.dataLogin);

    req.body.DataToInput = {
      ...Decrpypt,
    };
    delete req.body.dataLogin;

    checkBody(req.body.DataToInput.email, req.body.DataToInput.password, res);

    const getUser = await getUserData(req.body.DataToInput.email);

    // if username, email and npwp don't exist
    if (!getUser) {
      return errorResponse(res, httpStatus.notFound, "User not found!");
    }

    const result = getUser.toJSON();

    // Check password
    if (checkHashText(result.password, req.body.DataToInput.password)) {
      // User Biasa
      if (result.Role.name !== "User") {
        return errorResponse(
          res,
          httpStatus.unauthenticated,
          "Login failed! Unauthorized Role"
        );
      }
      // if the password is correct
      const token = generateToken({
        email: result.email,
        user_id: result.id,
      });
      return res.status(httpStatus.ok).json({
        success: true,
        message: "Success login",
        data: {
          token: token,
          permission: AESEncrypt(ConvertPermission(result.UserPrivilages)),
        },
      });
    } else {
      // if the password is not correct
      return errorResponse(
        res,
        httpStatus.unauthenticated,
        "Login failed, enter the correct password!"
      );
    }
  } catch (error) {
    // if there is a system error
    return errorResponse(res, httpStatus.internalServerError, "Login failed!");
  }
};

const loginActionBeaCukai = async (req, res) => {
  try {
    const Decrpypt = Encryption.AESDecrypt(req.body.dataLogin);

    req.body.DataToInput = {
      ...Decrpypt,
    };
    delete req.body.dataLogin;

    checkBody(req.body.DataToInput.email, req.body.DataToInput.password, res);

    const getUser = await getUserData(req.body.DataToInput.email);

    if (!getUser) {
      return errorResponse(res, httpStatus.notFound, "User not found!");
    }

    const result = getUser.toJSON();

    if (checkHashText(result.password, req.body.DataToInput.password)) {
      // Bea Cukai
      if (result.Role.name !== "Admin") {
        return errorResponse(
          res,
          httpStatus.unauthenticated,
          "Login failed! Unauthorized Role"
        );
      }
      // if the password is correct
      const token = generateToken({ email: result.email, user_id: result.id });
      return res
        .status(httpStatus.ok)
        .json({ success: true, message: "Login Success", data: token });
    } else {
      // if the password is not correct
      return errorResponse(
        res,
        httpStatus.unauthenticated,
        "Login failed, enter the correct password!"
      );
    }
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "Login failed");
  }
};

const loginActionOwner = async (req, res) => {
  try {
    const Decrpypt = Encryption.AESDecrypt(req.body.dataLogin);

    req.body.DataToInput = {
      ...Decrpypt,
    };
    delete req.body.dataLogin;

    checkBody(req.body.DataToInput.email, req.body.DataToInput.password, res);

    const getUser = await getUserData(req.body.DataToInput.email);

    if (!getUser) {
      return errorResponse(res, httpStatus.notFound, "User not found!");
    }

    const result = getUser.toJSON();

    if (checkHashText(result.password, req.body.DataToInput.password)) {
      if (result.Role.name !== "Owner") {
        return errorResponse(
          res,
          httpStatus.unauthenticated,
          "Login failed! Unauthorized Role"
        );
      }

      const token = generateToken({ email: result.email, user_id: result.id });
      return res
        .status(httpStatus.ok)
        .json({ success: true, message: "Login Success", data: token });
    } else {
      return errorResponse(
        res,
        httpStatus.unauthenticated,
        "Login failed, Enter the correct Password"
      );
    }
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, "Login failed");
  }
};

module.exports = (router) => {
  router.post("/", validationBody, loginAction);
  router.post("/bea-cukai", validationBody, loginActionBeaCukai);
  router.post("/owner", validationBody, loginActionOwner);
};
