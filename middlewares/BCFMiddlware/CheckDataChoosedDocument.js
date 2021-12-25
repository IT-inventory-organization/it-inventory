const Encrypt = require('../../helper/encription');
const Http = require('../../helper/Httplib'); 
const { errorResponse } = require('../../helper/Response');

const checkFormatData = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataBCF);

        req.body.data = {
            idReport: Decrypt.idReport,
            listBCF: Decrypt.listBCF
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

module.exports = {
    checkFormatData
}