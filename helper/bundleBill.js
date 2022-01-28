const { AESDecrypt } = require("./encription");
const httpStatus = require("./Httplib");
const { errorResponse } = require("./Response");

const BBill = async (req, res, next) => {
  try {
    const Decrypt = AESDecrypt(req.body.dataBill);

    req.body.DataToInput = {
      ...Decrypt,
      userId: req.currentUser,
    };

    next();
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.badRequest,
      "Failed To Create Card List"
    );
  }
};

module.exports = {
  BBill,
};
