const Encrypt = require('../../helper/encription');
const Http = require('../../helper/Httplib'); 
const { errorResponse } = require('../../helper/Response');

const formatDataDokumenMasukan = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            dataPemasukan:{
                ...Decrypt.dataPemasukan,
                reportId: Decrypt.reportId
            }
        }
    
        // console.log(req.body);
        next();
    } catch (error) {
        // console.log(error);
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenTambahan = async (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            dataTambahan:{
                ...Decrypt.dataTambahan,
                reportId: Decrypt.reportId
            }
        }
        // console.log(req.body.ref)
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
} 

const formatDataDokumenPelabuhan = async(req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            dataPelabuhan: {
                ...Decrypt.dataPelabuhan,
                reportId: Decrypt.reportId
            }
        }

        console.log(req.body.ref)
        // next()
    } catch (error) {
        console.log(error)
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data")
    }
}

module.exports = {
    formatDataDokumenMasukan,
    formatDataDokumenTambahan,
    formatDataDokumenPelabuhan
}