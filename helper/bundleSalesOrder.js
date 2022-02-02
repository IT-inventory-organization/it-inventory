const httpStatus = require("./Httplib");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");

const BSalesOrder = (req, res, next) => {
  try {
    if (!req.body) {
      return errorResponse(res, httpStatus.badRequest, "No Input is Provided");
    }

    const Decrypt = Encryption.AESDecrypt(req.body.dataSo);

    req.body.DataToInput = {
      ...Decrypt,
      userId: req.currentUser,
    };

    next();
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.badRequest,
      "Failed To Create Sales Order"
    );
  }
};

module.exports = {
  BSalesOrder,
};
