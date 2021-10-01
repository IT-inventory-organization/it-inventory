const Http = require("./Httplib");
const {convertStrignToDateUTC} = require("./convert");
const {errorResponse} = require("./Response");
const Encryption = require('./encription');

const dataBarang = (req, res, next) => {
    try {
        if(!req.body || typeof req.body === 'undefined'){
            return errorResponse(res, Http.badRequest, "Failed To Add Data", "No Document is Provided");
        }

        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        
        /**
         * End Testing
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);
        for (let i = 0; i < Decrypt.length; i++) {
            Decrypt[i].isDelete = false;
        }

        req.DataToInput = {
            listBarang: Decrypt
        }
        next();
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
};

module.exports = {
    dataBarang
}