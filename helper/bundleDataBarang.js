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
            // Decrypt.listDataBarang[i].nilaiPabeanHargaPenyerahan = parseFloat(Decrypt.listDataBarang[i].nilaiPabeanHargaPenyerahan)
            Decrypt.listDataBarang[i].isDelete = false;
            Decrypt.listDataBarang[i].reportId = Decrypt.reportId; 
        }
        
        req.body.DataToInput = {
            listDataBarang: Decrypt.listDataBarang,
            reportId: Decrypt.reportId
        }
        
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
};

const BDataBarang = (req, res, next) => {
    try {
        if(!req.body || typeof req.body === 'undefined'){
            return errorResponse(res, Http.badRequest, "No Document Is Provided");
        }

        const Decrypt = Encryption.AESDecrypt(req.body.dataBarang);

        for(let i = 0; i < Decrypt.listDataBarang.length; i++){
            Decrypt.listDataBarang[i].reportId = Decrypt.reportId
        }

        req.body.DataToInput = {
            listDataBarang: Decrypt.listDataBarang,
            reportId: Decrypt.reportId
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data Barang", error)
    }
}

module.exports = {
    dataBarang,
    BDataBarang
}