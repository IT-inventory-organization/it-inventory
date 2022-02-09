const httpStatus = require("./Httplib");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
const BSaldoAwal = (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(res, httpStatus.badRequest, "No Input is Provided");
    }

    const Decrypt = Encryption.AESDecrypt(req.body.saldoAwal);

    req.body.DataToInput = {
      ...Decrypt,
      userId: req.currentUser,
    };
    // console.log(req.body.DataToInput);
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
  BSaldoAwal,
};
