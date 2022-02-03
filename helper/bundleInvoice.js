const Http = require("./Httplib");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");
const { addZero } = require("./convert");

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

module.exports = {
  BInvoice,
};
