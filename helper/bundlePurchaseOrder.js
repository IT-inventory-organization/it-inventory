const Http = require("./Httplib");
const { convertStrignToDateUTC } = require("./convert");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");

const BPurchaseOrder = (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(res, Http.badRequest, "No Input is Provided");
    }

    const Decrypt = Encryption.AESDecrypt(req.body.dataPO);

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

module.exports = {
  BPurchaseOrder,
};
