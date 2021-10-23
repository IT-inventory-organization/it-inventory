const Http = require("./Httplib");
const {convertStrignToDateUTC} = require("./convert");
const {errorResponse} = require("./Response");
const Encryption = require('./encription');

const dataPengajuan = (req, res, next) => {

    try {
        
        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);

        const dataToInputPengajuan = {
            ...Decrypt.dataPengajuan,
            reportId: Decrypt.reportId
        }
    
        req.body.DataToInput = { 
            dataPengajuan: dataToInputPengajuan
        };

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const ppjk = (req, res, next) => {
    try {
        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);
        console.log(Decrypt)
        const dataToInputPPJK = {
            ...Decrypt.identitasPPJK,
            reportId: Decrypt.reportId
        }
        req.body.DataToInput = {
            ...req.body.DataToInput,
            identitasPPJK: dataToInputPPJK
        }

        next();
    } catch (error) {
        console.log(error)
        return errorResponse(res, Http.badRequest, "Failed Add Data", error.message)
    }
}

const identitasPenerima = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);
        /**
         * Key
         * caraAngkutPenerima
         * namaPengangkutPenerima
         * benderaPenerima
         * nomorVoyFlightPolPenerima
         */
        const dataToInputIdentitasPenerima = {
            ...Decrypt.identitasPenerima,
            reportId: Decrypt.reportId
        };

        req.body.DataToInput = { 
            ...req.body.DataToInput, 
            identitasPenerima: dataToInputIdentitasPenerima
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const identitasPengirim = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);

        Decrypt.identitasPengirim.tanggalIjinBpkPengirim = convertStrignToDateUTC(Decrypt.identitasPengirim.tanggalIjinBpkPengirim);
        const dataToInputIdentitasPengirim = {
            ...Decrypt.identitasPengirim,
            reportId: Decrypt.reportId
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            identitasPengirim: dataToInputIdentitasPengirim
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const transaksiPerdagangan = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);

        const dataToInputTransaksiPerdagangan = {
            ...Decrypt.transaksiPerdagangan,
            reportId: Decrypt.reportId
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            transaksiPerdagangan: dataToInputTransaksiPerdagangan
        }

        
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const dataPengangkut = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);

        const dataToInputDataPengangkut = {
            ...Decrypt.dataPengangkutan,
            reportId: Decrypt.reportId
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataPengangkutan: dataToInputDataPengangkut
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const dataPelabuhanMuatBongkar = (req, res, next) => {
    try {
        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);
        
        const dataToInputDataPelabuhanMuatBongkar = {
            ...Decrypt.dataPelabuhanMuatBongkar,
            reportId: Decrypt.reportId
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataPelabuhanMuatBongkar: dataToInputDataPelabuhanMuatBongkar
        };
        
        next();

    } catch (error) {
        console.error(error)
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const beratDanVolume = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);
        const dataToInputBeratDanVolume = {
            ...Decrypt.dataBeratDanVolume,
            reportId: Decrypt.reportId
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataBeratDanVolume: dataToInputBeratDanVolume
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const dataPetiKemasDanPengemas = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);
        const dataToInputDataPetiKemasDanPengemas = {
            ...Decrypt.dataPetiKemasDanPengemas,
            reportId: Decrypt.reportId
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataPetiKemasDanPengemas: dataToInputDataPetiKemasDanPengemas
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
}

const dataPerkiraanTanggalPengeluaran = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);

        Decrypt.dataPerkiraanTanggalPengeluaran.perkiraanTanggalPengeluaran = convertStrignToDateUTC(Decrypt.dataPerkiraanTanggalPengeluaran.perkiraanTanggalPengeluaran);

        const dataToInputDataPerkiraanTanggalPengeluaran = {
            ...Decrypt.dataPerkiraanTanggalPengeluaran,
            reportId: Decrypt.reportId
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataPerkiraanTanggalPengeluaran: dataToInputDataPerkiraanTanggalPengeluaran
        }
        if('idReport' in req.body){
            delete req.body.dataHeader;
        }
        
        next();

    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const dataTempatPenimbunan = (req, res, next) => {
    try {
        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);
        const dataToInputDataTempatPenimbunan = {
            ...Decrypt.dataTempatPenimbunan,
            reportId: Decrypt.reportId
        }
        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataTempatPenimbunan: dataToInputDataTempatPenimbunan
        }
        
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const dataLartas = (req, res, next) => {
    try {

        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);
        const dataToInputLartas = {
            ...Decrypt.dataLartas,
            reportId: Decrypt.reportId
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataLartas: dataToInputLartas
        }

        
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}
/**
 * Id Report, Id Data PEngajuan, Id Identitas Pengirim, Id Identitas Penerima, Id Transaksi Perdagangan
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const idReport = (req, res, next) => {
    try {
        const Decrypt = Encryption.AESDecrypt(req.body.dataHeader);
        
        const dataToSearchId = {
            // reportId: Decrypt.reportId,
            ...Decrypt.idReport
        }

        req.body.DataToInput = {
            ...req.body.DataToInput,
            dataSearchReport: dataToSearchId
        }


        delete req.body.dataHeader;
        next()
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

module.exports = {
    dataPengajuan,
    identitasPenerima,
    identitasPengirim,
    transaksiPerdagangan,
    dataPengangkut,
    dataPelabuhanMuatBongkar,
    beratDanVolume,
    dataPetiKemasDanPengemas,
    dataPerkiraanTanggalPengeluaran,
    dataTempatPenimbunan,
    idReport,
    dataLartas,
    ppjk
}