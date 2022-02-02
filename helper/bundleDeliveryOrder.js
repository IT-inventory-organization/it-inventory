const httpStatus = require("./Httplib");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");

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

module.exports = {
  BDeliveryOrder,
};
