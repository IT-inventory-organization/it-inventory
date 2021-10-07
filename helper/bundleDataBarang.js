const Http = require("./Httplib");
const {convertStrignToDateUTC} = require("./convert");
const {errorResponse} = require("./Response");
const Encryption = require('./encription');

const dataBarang = (req, res, next) => {
    try {
        if(!req.body || typeof req.body === 'undefined'){
            return errorResponse(res, Http.badRequest, "Failed To Add Data", "No Document is Provided");
        }

        const Decrypt = Encryption.AESDecrypt(req.body.dataBarang);

        for (let i = 0; i < Decrypt.dataBarang.length; i++) {
            Decrypt.dataBarang[i].isDelete = false;
            Decrypt.dataBarang[i].reportId = Decrypt.reportId; 
        }
        
        req.body.DataToInput = {
            dataBarang: Decrypt.dataBarang,
            reportId: Decrypt.reportId
        }

        delete req.body.dataBarang;
        // console.log(req.body.DataToInput);return;
        
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
};

module.exports = {
    dataBarang
}