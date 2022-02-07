const { validationResult } = require("express-validator");
const Http = require("../helper/Httplib");
const { errorResponse } = require("../helper/Response");

/**
 * Mengecek Response Yang Diberi User
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const validationResponse = (req, res, next) => {
  const validation = validationResult(req);
  // console.log(validation.array());
  if (!validation.isEmpty()) {
    return errorResponse(res, Http.badRequest, validation.array()[0].msg);
  }
  // console.log(req.body.DataToInput);
  // return;
  next();
};

module.exports = {
  validationResponse,
};
