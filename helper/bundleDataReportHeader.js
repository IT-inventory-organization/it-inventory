const Http = require("./Httplib");
const {convertStrignToDateUTC} = require("./convert");
const {errorResponse} = require("./Response");

const dataPengajuan = (req, res, next) => {
    try {
        const dataToInputPengajuan = {
            kantorPabeanAsal: req.body.kantorPabeanAsal,
            kategoryPemberitahuan: req.body.kategoryPemberitahuan,
            kategoryPengeluaran: req.body.kategoryPengeluaran,
            tujuanPengeluan: req.body.tujuanPengeluaran,
            asalBarang: req.body.asalBarang,
            caraPembayaran: req.body.caraPembayaran,
            reportId: req.body.reportId
        }
    
        req.DataToInput = { 
            Pengajuan: dataToInputPengajuan
        };

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const identitasPenerima = (req, res, next) => {
    try {
        const dataToInputIdentitasPenerima = {
            jenisIdentitasPenerima: req.body.jenisIdentitasPenerima,
            nomorIdentitasPenerima: req.body.nomorIdentitasPenerima,
            namaPenerima: req.body.namaPenerima,
            alamatPenerima: req.body.alamatPenerima,
            reportId: req.body.reportId
        };

        req.DataToInput = { 
            ...req.DataToInput, 
            IdentitasPenerima: dataToInputIdentitasPenerima
        }
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const identitasPengirim = (req, res, next) => {
    try {

        const date = convertStrignToDateUTC(req.body.tanggalIjinBpkPengirim);
        const dataToInputIdentitasPengirim = {
            jenisIdentitasPengirim: req.body.jenisIdentitasPengirim,
            nomorIdentitasPengirim: req.body.nomorIdentitasPengirim,
            namaPengirim: req.body.namaPengirim,
            alamatPengirim: req.body.alamatPengirim,
            nomorIjinBpkPengirim: req.body.nomorIjinBpkPengirim,
            tanggalIjinBpkPengirim: date,
            reportId: req.body.reportId
        }

        req.DataToInput = {
            ...req.DataToInput,
            IdentitasPengirim: dataToInputIdentitasPengirim
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const transaksiPerdagangan = (req, res, next) => {
    try {
        const dataToInputTransaksiPerdagangan = {
            transaksi: req.body.transaksi,
            transaksiLainnya: req.body.transaksiLainnya,
            valuta: req.body.valuta,
            kursNDPBM: req.body.kursNDPBM,
            cif: req.body.cif,
            voluntaryDeclaration: req.body.voluntaryDeclaration,
            freight: req.body.freight,
            reportId: req.body.reportId
        }

        req.DataToInput = {
            ...req.DataToInput,
            TransaksiPerdagangan: dataToInputTransaksiPerdagangan
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
        const dataToSearchId = {
            dataPengajuanId: req.body.dataPengajuanId,
            identitasPenerimaId: req.body.identitasPenerimaId,
            identitasPengirimId: req.body.identitasPengirimId,
            TransaksiPerdaganganId: req.body.TransaksiPerdaganganId
        }

        req.DataToInput = {
            ...req.DataToInput,
            dataSearchReport: dataToSearchId
        }

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
    idReport
}