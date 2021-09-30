const Http = require("./Httplib");
const {convertStrignToDateUTC} = require("./convert");
const {errorResponse} = require("./Response");
const Encryption = require('./encription');

const dataPengajuan = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);

        const dataToInputPengajuan = {
            kantorPabeanAsal: Decrypt.kantorPabeanAsal,
            kategoryPemberitahuan: Decrypt.kategoryPemberitahuan,
            kategoryPengeluaran: Decrypt.kategoryPengeluaran,
            tujuanPengeluan: Decrypt.tujuanPengeluaran,
            asalBarang: Decrypt.asalBarang,
            caraPembayaran: Decrypt.caraPembayaran,
            reportId: Decrypt.reportId
        }
    
        req.DataToInput = { 
            pengajuan: dataToInputPengajuan
        };

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const identitasPenerima = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);

        const dataToInputIdentitasPenerima = {
            jenisIdentitasPenerima: Decrypt.jenisIdentitasPenerima,
            nomorIdentitasPenerima: Decrypt.nomorIdentitasPenerima,
            namaPenerima: Decrypt.namaPenerima,
            alamatPenerima: Decrypt.alamatPenerima,
            reportId: Decrypt.reportId
        };

        req.DataToInput = { 
            ...req.DataToInput, 
            identitasPenerima: dataToInputIdentitasPenerima
        }

        // console.info(dataToInputIdentitasPenerima);return;
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const identitasPengirim = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);

        const date = convertStrignToDateUTC(Decrypt.tanggalIjinBpkPengirim);
        const dataToInputIdentitasPengirim = {
            jenisIdentitasPengirim: Decrypt.jenisIdentitasPengirim,
            nomorIdentitasPengirim: Decrypt.nomorIdentitasPengirim,
            namaPengirim: Decrypt.namaPengirim,
            alamatPengirim: Decrypt.alamatPengirim,
            nomorIjinBpkPengirim: Decrypt.nomorIjinBpkPengirim,
            tanggalIjinBpkPengirim: date,
            reportId: Decrypt.reportId
        }

        req.DataToInput = {
            ...req.DataToInput,
            identitasPengirim: dataToInputIdentitasPengirim
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const transaksiPerdagangan = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);

        const dataToInputTransaksiPerdagangan = {
            transaksi: Decrypt.transaksi,
            transaksiLainnya: Decrypt.transaksiLainnya,
            valuta: Decrypt.valuta,
            kursNDPBM: Decrypt.kursNDPBM,
            cif: Decrypt.cif,
            voluntaryDeclaration: Decrypt.voluntaryDeclaration,
            freight: Decrypt.freight,
            reportId: Decrypt.reportId
        }

        req.DataToInput = {
            ...req.DataToInput,
            transaksiPerdagangan: dataToInputTransaksiPerdagangan
        }
        
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const dataPengangkut = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);

        const dataToInputDataPengangkut = {
            caraAngkut: Decrypt.caraAngkut,
            namaPengangkut: Decrypt.namaPengangkut,
            bendera: Decrypt.bendera,
            nomorVoyFlightPol: Decrypt.nomorVoyFlightPol,
            reportId: Decrypt.reportId
        }

        req.DataToInput = {
            ...req.DataToInput,
            pengangkutan: dataToInputDataPengangkut
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const dataPelabuhanMuatBongkar = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);

        const dataToInputDataPelabuhanMuatBongkar = {
            pelabuhanMuat: Decrypt.pelabuhanMuat,
            pelabuhanTujuan: Decrypt.pelabuhanTujuan,
            pelabuhanTransit: Decrypt.pelabuhanTransit,
            reportId: Decrypt.reportId
        }

        req.DataToInput = {
            ...req.DataToInput,
            pelabuhanMuatBongkar: dataToInputDataPelabuhanMuatBongkar
        };
        
        next();

    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const beratDanVolume = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);
        const dataToInputBeratDanVolume = {
            beratBersih: Decrypt.beratBersih,
            beratKotor: Decrypt.beratKotor,
            volume: Decrypt.volume,
            reportId: Decrypt.reportId
        }

        req.DataToInput = {
            ...req.DataToInput,
            beratDanVolume: dataToInputBeratDanVolume
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const dataPetiKemasDanPengemas = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);
        const dataToInputDataPetiKemasDanPengemas = {
            jumlahJenisKemasan: Decrypt.jumlahJenisKemasan,
            jumlahPetiKemas: Decrypt.jumlahPetiKemas,
            jumlahJenisBarang: Decrypt.jumlahJenisBarang,
            reportId: Decrypt.reportId
        }

        req.DataToInput = {
            ...req.DataToInput,
            petiKemasDanPengemas: dataToInputDataPetiKemasDanPengemas
        }

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
}

const dataPerkiraanTanggalPengeluaran = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);
        const date = convertStrignToDateUTC(Decrypt.perkiraanTanggalPengeluaran);

        const dataToInputDataPerkiraanTanggalPengeluaran = {
            perkiraanTanggalPengeluaran: date,
            reportId: Decrypt.reportId
        }

        req.DataToInput = {
            ...req.DataToInput,
            perkiraanTanggalPengeluaran: dataToInputDataPerkiraanTanggalPengeluaran
        }
        
        next();

    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error);
    }
}

const dataTempatPenimbunan = (req, res, next) => {
    try {
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);
        const dataToInputDataTempatPenimbunan = {
            tempatPenimbunan: Decrypt.tempatPenimbunan,
            reportId: Decrypt.reportId
        }
        req.DataToInput = {
            ...req.DataToInput,
            tempatPenimbunan: dataToInputDataTempatPenimbunan
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
        /**
         * Testing Purpose
         */
        const Encrypt = Encryption.AESEncrypt(req.body);
        /**
         * End Testing Purpose
         */
        const Decrypt = Encryption.AESDecrypt(Encrypt);
        const dataToSearchId = {
            reportId: Decrypt.reportId,
            dataPengajuanId: Decrypt.dataPengajuanId,
            identitasPenerimaId: Decrypt.identitasPenerimaId,
            identitasPengirimId: Decrypt.identitasPengirimId,
            transaksiPerdaganganId: Decrypt.transaksiPerdaganganId,
            pengangkutanId: Decrypt.pengangkutanResultId,
            pelabuhanMuatBongkarId: Decrypt.pelabuhanMuatBongkarId,
            beratDanVolumeId: Decrypt.beratDanVolumeId,
            petiKemasDanPengemasId: Decrypt.petiKemasDanPengemasId,
            tempatPenimbunanId: Decrypt.tempatPenimbunanId,
            perkiraanTanggalId: Decrypt.perkiraanTanggalId
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
    dataPengangkut,
    dataPelabuhanMuatBongkar,
    beratDanVolume,
    dataPetiKemasDanPengemas,
    dataPerkiraanTanggalPengeluaran,
    dataTempatPenimbunan,
    idReport
}