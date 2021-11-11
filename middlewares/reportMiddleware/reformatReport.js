const Encrypt = require('../../helper/encription');
const Http = require('../../helper/Httplib'); 
const { errorResponse } = require('../../helper/Response');

const formatReport = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataReport);

        req.body.ref = {
            ...Decrypt,
            userId: +req.currentUser
        }
    
        // console.log(req.body);
        next();
    } catch (error) {
        console.log(error);
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

module.exports = {formatReport}