const Encrypt = require('../../helper/encription');
const Http = require('../../helper/Httplib'); 
const { errorResponse } = require('../../helper/Response');


const formatDataDokumenMasukan = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            dokumenPemasukan:{
                ...Decrypt.dokumenPemasukan,
                reportId: Decrypt.reportId
            }
        }

        next();
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

<<<<<<< HEAD
const formatDataDokumenPengeluaran = (req, res, next) => {
=======
const formatDataDokumenKeluaran = (req, res, next) => {
>>>>>>> 352c5c4597c62d05a2a532fe0a22749db9fedfc6
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            dokumenPengeluaran:{
                ...Decrypt.dokumenPengeluaran,
                reportId: Decrypt.reportId
            }
        }

        next();
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenTambahan =  (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

 
        req.body.ref = {
            ...req.body.ref,
            dokumenTambahan:{
                ...Decrypt.dokumenTambahan,
                reportId: Decrypt.reportId
            }
        }

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


        next()
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenPembeliBarang = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            pembeliBarang: {
                ...Decrypt.pembeliBarang,
                reportId: Decrypt.reportId
            }
        }

        next();
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

        next();
    } catch (error) {

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

        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data")
    }
}

module.exports = {
    formatDataDokumenMasukan,
    formatDataDokumenKeluaran,
    formatDataDokumenTambahan,
    formatDataDokumenPelabuhan,
    formatDataDokumenKapal,
    formatDataDokumenIdentitasBarang,
    formatDataDokumenPenjualBarang,
    formatDataDokumenPengirimBarang,
    formatDataDokumenPembeliBarang,
    formatDataDokumenPengusahaPLB,
    formatDataDokumenPpjk,
    formatDataDokumenMataUang,
    formatDataDokumenDataPengangkutan,
    formatDataDokumenBeratDanVolume,
    formatDataDokumenTempatPenimbunan
}
