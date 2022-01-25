const Http = require("./Httplib");
const { errorResponse } = require("./Response");
const Encryption = require("./encription");

const bundleReport = (req, res, next) => {
  try {
    const Decrypt = Encryption.AESDecrypt(req.body.dataReport);
    const { type } = req.query;
    // const arr = ['BC 2.3', 'BC 2.7', 'BC 4.0', 'BC 2.6.2', 'BC 4.1', 'BC 2.5', 'BC 2.7', 'BC 2.6.1', 'BC 01', 'BC 02', 'BC 03'];
    // const inOut = ['BC 01', 'BC 2.3', 'BC 2.7', 'BC 03', 'BC 02'];
    // const In = ['BC 4.0', 'BC 2.6.2'];
    // const Out = ['BC 4.1', 'BC 2.6.1', 'BC 2.5'];

    /**
     * BC 01 Masuk Keluar
     * BC 02
     * BC 03
     */

    // if(arr.indexOf(Decrypt.BCDocumentType) == -1){
    //     return errorResponse(res, Http.badRequest, "Document Type is Not Acceptable");
    // }

    // let jenisMasuk = ``;
    // /**

    // if(In.indexOf(Decrypt.BCDocumentType) != -1){
    //     jenisMasuk = 'in';
    // }else if(Out.indexOf(Decrypt.BCDocumentType) != -1){
    //     jenisMasuk = 'out';
    // }else if(inOut.indexOf(Decrypt.BCDocumentType) != -1){
    //     jenisMasuk = 'in out';
    // }else{
    //     return errorResponse(res, Http.badRequest, "Document Type Invalid")
    // }

    req.body.DataToInput = {
      ...Decrypt,
      isDelete: false,
      typeReport: type,
      userId: req.currentUser,
    };

    next();
  } catch (error) {
    return errorResponse(res, Http.badRequest, "Failed To Add Data");
  }
};

const bundleReportUpdate = (req, res, next) => {
  try {
    const Decrypt = Encryption.AESDecrypt(req.body.dataReport);

    const arr = [
      "BC 2.3",
      "BC 2.7",
      "BC 4.0",
      "BC 2.6.2",
      "BC 4.1",
      "BC 2.5",
      "BC 2.7",
      "BC 2.6.1",
      "BC 01",
      "BC 02",
      "BC 03",
    ];

    const inOut = ["BC 01", "BC 2.3", "BC 2.7", "BC 02"];
    const In = ["BC 4.0", "BC 2.6.2", "BC 03"];
    const Out = ["BC 4.1", "BC 2.6.1", "BC 2.5"];

    if (arr.indexOf(Decrypt.BCDocumentType) == -1) {
      return errorResponse(
        res,
        Http.badRequest,
        "Document Type is Not Acceptable"
      );
    }

    let jenisMasuk = ``;

    if (In.indexOf(Decrypt.BCDocumentType) != -1) {
      jenisMasuk = "in";
    } else if (Out.indexOf(Decrypt.BCDocumentType) != -1) {
      jenisMasuk = "out";
    } else if (inOut.indexOf(Decrypt.BCDocumentType) != -1) {
      jenisMasuk = "in out";
    } else {
      return errorResponse(res, Http.badRequest, "Document Type Invalid");
    }

    req.body.DataToInput = {
      ...Decrypt,
      jenisMasuk,
      isDelete: false,
      userId: req.currentUser,
    };
    if (typeof type === "undefined" || type == null) {
      delete req.body.DataToInput.typeReport;
    }

    next();
  } catch (error) {
    return errorResponse(res, Http.badRequest, "Failed To Add Data");
  }
};
module.exports = {
  bundleReport,
};
