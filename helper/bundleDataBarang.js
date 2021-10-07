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

        for (let i = 0; i < Decrypt.listDataBarang.length; i++) {
            Decrypt.listDataBarang[i].isDelete = false;
            Decrypt.listDataBarang[i].reportId = Decrypt.reportId; 
        }
        
        req.body.DataToInput = {
            listDataBarang: Decrypt.listDataBarang,
            reportId: Decrypt.reportId
        }
        // console.log(req.body.DataToInput); return;
        
        next();
    } catch (error) {
        console.log(error);
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
};

module.exports = {
    dataBarang
}