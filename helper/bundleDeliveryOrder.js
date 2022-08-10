const httpStatus = require("./Httplib");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");
const e = require("express");

const BDeliveryOrder = (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(res, httpStatus.badRequest, "No Input is Provided");
    }

    const Decrypt = Encryption.AESDecrypt(req.body.dataDO);

    req.body.DataToInput = {
      ...Decrypt,
      userId: req.currentUser,
    };

    next();
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Create Delivery Order"
    );
  }
};

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
const BUpdateStatusDeliveryOrder = (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(
        res,
        httpStatus.badRequest,
        "Body Delivery Order is Empty"
      );
    }

    const Decrypt = Encryption.AESDecrypt(req.body.dataStatus);

    if (Decrypt.status.toString() !== "") {
      req.body = Decrypt;
      return next();
    }

    return errorResponse(
      res,
      httpStatus.badRequest,
      "Status For Delivery Order Is Empty"
    );
  } catch (error) {
    console.log(error);
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Update Status Delivery Order"
    );
  }
};

module.exports = {
  BDeliveryOrder,
  BUpdateStatusDeliveryOrder,
};
