const e = require("express");
const { body, validationResult } = require("express-validator");
const { ChangePw, FindUser } = require("../../helper/A_User");
const { createHashText, checkHashText } = require("../../helper/bcrypt");
const httpStatus = require("../../helper/Httplib");
const { errorResponse, successResponse } = require("../../helper/Response");
const { passwordFormat } = require("../../helper/validation");
const authentication = require("../../middlewares/authentication");

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
const CheckPw = async (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(res, httpStatus.badRequest, "Form is Empty");
    }

    if (!req.body.oldPassword) {
      return errorResponse(
        res,
        httpStatus.badRequest,
        "Old Password Is Required"
      );
    }

    const idUser = req.currentUser;
    const findUser = await FindUser(idUser);
    const json = findUser.toJSON();

    if (!checkHashText(json.password, req.body.oldPassword)) {
      return errorResponse(
        res,
        httpStatus.conflict,
        "It Seems The Old Password is Incorrect, Try Again"
      );
    }

    if (!req.body.newPassword) {
      return errorResponse(
        res,
        httpStatus.badRequest,
        "New Password Is Required"
      );
    }

    if (!req.body.confirmPassword) {
      return errorResponse(
        res,
        httpStatus.badRequest,
        "Confirm Password Is Required"
      );
    }

    passwordFormat(req.body.newPassword);

    if (req.body.newPassword !== req.body.confirmPassword) {
      return errorResponse(
        res,
        httpStatus.conflict,
        "New Password is Not A Same As Confirm Password"
      );
    }

    return next();
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      error.message ?? "Failed To Update Password"
    );
  }
};

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
const ChangeThePassword = async (req, res) => {
  try {
    const idUser = req.currentUser;

    await ChangePw(idUser, createHashText(req.body.newPassword));

    return successResponse(res, httpStatus.accepted, "Success Update Password");
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Change Password"
    );
  }
};

/**
 *
 * @param {e.Application} routes
 */
module.exports = (routes) => {
  routes.put("/change/pw", authentication, CheckPw, ChangeThePassword);
};
