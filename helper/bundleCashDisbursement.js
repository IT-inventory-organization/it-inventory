const httpStatus = require("./Httplib");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
const BCashDisbursement = (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(res, httpStatus.badRequest, "No Input is Provided");
    }

    const Decrypt = Encryption.AESDecrypt(req.body.cashDisbursement);

    req.body.DataToInput = {
      ...Decrypt,
      userId: req.currentUser,
    };

    next();
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Create Recei Items"
    );
  }
};

module.exports = {
  BCashDisbursement,
};
