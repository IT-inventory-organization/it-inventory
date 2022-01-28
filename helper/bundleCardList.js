const { AESDecrypt } = require("./encription");
const httpStatus = require("./Httplib");
const { errorResponse } = require("./Response");

const BCardList = async (req, res, next) => {
  try {
    const Decrypt = AESDecrypt(req.body.dataCard);

    req.body.DataToInput = Decrypt;
    console.log(req.body.DataToInput);
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
  BCardList,
};
