const Http = require("./Httplib");
const {convertStrignToDateUTC} = require("./convert");
const {errorResponse} = require("./Response");
const Encryption = require('./encription');

const dataPO = (req, res, next) => {
    try {
        if(!req.body || typeof req.body === 'undefined'){
            return errorResponse(res, Http.badRequest, "Failed To Add Data", "No Document is Provided");
        }

        const Decrypt = Encryption.AESDecrypt(req.body.dataPO);

        for (let i = 0; i < Decrypt.listDataPO.length; i++) {
            Decrypt.listDataPO[i].isDelete = false;
            Decrypt.listDataPO[i].reportId = Decrypt.reportId; 
        }
        
        req.body.DataToInput = {
            listDataPO: Decrypt.listDataPO,
            reportId: Decrypt.reportId
        }
        
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
};

const BDataPO = (req, res, next) => {
    try {
        if(!req.body || typeof req.body === 'undefined'){
            return errorResponse(res, Http.badRequest, "No Document Is Provided");
        }

        const Decrypt = Encryption.AESDecrypt(req.body.dataPO);

        for(let i = 0; i < Decrypt.listDataPO.length; i++){
            Decrypt.listDataPO[i].reportId = Decrypt.reportId
        }

        req.body.DataToInput = {
            ...Decrypt
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data Purchase Order", error)
    }
}

module.exports = {
    dataPO,
    BDataPO
}