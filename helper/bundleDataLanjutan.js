const Http = require("./Httplib");
const {convertStrignToDateUTC} = require("./convert");
const {errorResponse} = require("./Response");
const Encryption = require('./encription');
const { lazyrouter } = require("express/lib/application");

const dataDokumen = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataLanjutan);
        // console.log(Decrypt);return;
        for (let i = 0; i < Decrypt.dataDokumen.length; i++) {
            Decrypt.dataDokumen[i].tanggalDokumen = convertStrignToDateUTC(Decrypt.dataDokumen[i].tanggalDokumen);
            Decrypt.dataDokumen[i].reportId = Decrypt.reportId;
            Decrypt.dataDokumen[i].isDelete = false; //
        }

        const cDataDokumen = [ ...Decrypt.dataDokumen ];

        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataDokumen: cDataDokumen,
        }
        // console.log(req.body.DataToInput);return;
        
        next();
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, error.message);
    }
}

const petiKemas = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataLanjutan);
        const cPetiKemas = {
            ...Decrypt.dataPetiKemas,
            reportId: Decrypt.reportId,
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataPetiKemas: cPetiKemas,
        }
        delete req.body.dataLanjutan;
        // console.log(req.body.DataToInput);return;
        
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
}

module.exports = {
    dataDokumen,
    petiKemas
}