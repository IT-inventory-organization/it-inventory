const Encrypt = require('../helper/encription');
const Http = require('../helper/Httplib'); 
const { errorResponse } = require('../helper/Response');

const formatDataDokumen = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...Decrypt
        }
    
        console.log(req.body);
        next();
    } catch (error) {
        console.log(error);
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

module.exports = {
    formatDataDokumen
}