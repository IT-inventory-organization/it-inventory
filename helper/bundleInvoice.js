const Http = require("./Httplib");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");
const { addZero } = require("./convert");
const e = require("express");
const httpStatus = require("./Httplib");

const BInvoice = (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(res, Http.badRequest, "No Input is Provided");
    }

    const Decrypt = Encryption.AESDecrypt(req.body.invoice);
    const tempDate = new Date(Decrypt.tanggalInvoice);

    tempDate.setDate(tempDate.getDate() + +Decrypt.jangkaWaktuString);

    Decrypt.jangkaWaktu = `${tempDate.getFullYear()}-${addZero(
      tempDate.getMonth() + 1
    )}-${addZero(tempDate.getDate())}`;

    req.body.DataToInput = {
      ...Decrypt,
      userId: req.currentUser,
    };

    next();
  } catch (error) {
    return errorResponse(
      res,
      Http.badRequest,
      "Failed To Create Purchase Order",
      error
    );
  }
};

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 */
const BUpdateStatusInvoice = (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(res, httpStatus.badRequest, "Body Value Is Empty");
    }

    const Decrypt = Encryption.AESDecrypt(req.body.dataStatus);

    if (Decrypt.status.toString() !== "") {
      req.body = Decrypt;

      return next();
    }

    return errorResponse(res, httpStatus.badRequest, "Status Value Is Empty");
  } catch (error) {}
};

module.exports = {
  BInvoice,
  BUpdateStatusInvoice,
};
