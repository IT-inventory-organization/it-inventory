const Http = require("./Httplib");
const {convertStrignToDateUTC} = require("./convert");
const {errorResponse} = require("./Response");
const Encryption = require('./encription');

const dataDokumen = (req, res, next) => {
    try {
        /**
         * Testing
         */
        const Encypt = Encryption.AESEncrypt(req.body)
        /**
         * End Testing
         */
        const Decrypt = Encryption.AESDecrypt(Encypt);
        
        const date = convertStrignToDateUTC(Decrypt.tanggalDokumen)
        const cDataDokumen = {
            kodeDokumen: Decrypt.kodeDokumen,
            nomorDokumen: Decrypt.nomorDokumen,
            tanggalDokumen: date,
            hsCode: Decrypt.hsCode,
            reportId: Decrypt.reportId
            
        }

        req.DataToInput = {
            ...req.DataToInput,
            listDokumen: cDataDokumen,
        }
        
        next();
    } catch (error) {
        // console.error(error)
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}
const petiKemas = (req, res, next) => {
    try {
        /**
         * Testing
         */
        const Encypt = Encryption.AESEncrypt(req.body)
        /**
         * End Testing
         */
        const Decrypt = Encryption.AESDecrypt(Encypt);
        const cPetiKemas = {
            dataKontainer: Decrypt.dataKontainer,
            volumeKontainer: Decrypt.volumeKontainer,
            reportId: Decrypt.reportId,
        }

        req.DataToInput = {
            ...req.DataToInput,
            petiKemas: cPetiKemas
        }
        
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
}

module.exports = {
    dataDokumen,
    petiKemas
}