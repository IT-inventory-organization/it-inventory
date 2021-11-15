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

const formatDataDokumenTambahan =  (req, res, next) => {
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

const formatDataDokumenPelabuhan = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            dataPelabuhan: {
                ...Decrypt.dataPelabuhan,
                reportId: Decrypt.reportId
            }
        }

        next()
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data")
    }
}

const formatDataDokumenKapal = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            dataKapal: {
                ...Decrypt.dataKapal,
                reportId: Decrypt.reportId
            }
        }

        // console.log(req.body);
        next();
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan data");
    }
}

const formatDataDokumenIdentitasBarang = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);
        
        req.body.ref = {
            ...req.body.ref,
            identitasBarang: {
                ...Decrypt.identitasBarang,
                reportId: Decrypt.reportId
            }
        }

        // console.log(req.body)
        next();
    } catch (error) {

        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenPenjualBarang = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            penjualBarang: {
                ...Decrypt.penjualBarang,
                reportId: Decrypt.reportId
            }
        }

        next()
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data")
    }
} 

const formatDataDokumenPengirimBarang = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            pengirimBarang: {
                ...Decrypt.pengirimBarang,
                reportId: Decrypt.reportId
            }
        }

        // console.log(req.body);
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenPengusahaPLB = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            pengusahaPLB: {
                ...Decrypt.pengusahaPLB,
                reportId: Decrypt.reportId
            }
        }

        // console.log(req.body);
        next()
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenPpjk = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            ppjk: {
                ...Decrypt.ppjk,
                reportId: Decrypt.reportId
            }
        }
        // console.log(req.body);
        next();
    } catch (error) {
        console.log('Middleware Format PPJK', error);
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenMataUang = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            mataUang: {
                ...Decrypt.mataUang,
                reportId: Decrypt.reportId
            }
        }

        // console.log(req.body);
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data")
    }
}

const formatDataDokumenDataPengangkutan = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            dataPengangkutan: {
                ...Decrypt.dataPengangkutan,
                reportId: Decrypt.reportId
            }
        }
        // console.log(req.body)
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenBeratDanVolume = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            beratDanVolume: {
                ...Decrypt.beratDanVolume,
                reportId: Decrypt.reportId
            }
        }

        // console.log(req.body.ref);
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenTempatPenimbunan = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);
        req.body.ref = {
            ...req.body.ref,
            tempatPenimbunan: {
                ...Decrypt.tempatPenimbunan,
                reportId: Decrypt.reportId
            }
        }

        // console.log(req.body);
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data")
    }
}

module.exports = {
    formatDataDokumenMasukan,
    formatDataDokumenTambahan,
    formatDataDokumenPelabuhan,
    formatDataDokumenKapal,
    formatDataDokumenIdentitasBarang,
    formatDataDokumenPenjualBarang,
    formatDataDokumenPengirimBarang,
    formatDataDokumenPengusahaPLB,
    formatDataDokumenPpjk,
    formatDataDokumenMataUang,
    formatDataDokumenDataPengangkutan,
    formatDataDokumenBeratDanVolume,
    formatDataDokumenTempatPenimbunan
}