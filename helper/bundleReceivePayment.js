const httpStatus = require("./Httplib");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");

const BReceivePayment = (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(res, httpStatus.badRequest, "No Input is Provided");
    }

    const Decrypt = Encryption.AESDecrypt(req.body.receivePayment);

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
  BReceivePayment,
};
