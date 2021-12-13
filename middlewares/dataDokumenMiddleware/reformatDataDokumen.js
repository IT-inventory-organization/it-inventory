const Encrypt = require('../../helper/encription');
const Http = require('../../helper/Httplib'); 
const { errorResponse } = require('../../helper/Response');


const formatDataDokumenMasukan = (req, res, next) => {
    // console.log(req.body)
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);
        // console.log(Decrypt)
        req.body.ref = {
            ...req.body.ref,
            dokumenPemasukan:{
                ...Decrypt.dokumenPemasukan,
                reportId: Decrypt.reportId
            }
        }
        console.log('masukan')
        next();
    } catch (error) {
        console.log(error,"error formatDataDokumenMasukan")
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenKeluaran = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        req.body.ref = {
            ...req.body.ref,
            dokumenPengeluaran:{
                ...Decrypt.dokumenPengeluaran,
                reportId: Decrypt.reportId
            }
        }
        // console.log(req.body.ref)
        console.log(error,"error formatDataDokumenKeluaran")

        next();
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenTambahan =  (req, res, next) => {
    console.log("formatDataDokumenTambahan")


    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataDokumen);

        // convert(Decrypt);
        req.body.ref = {
            ...req.body.ref,
            dokumenTambahan:{
                ...Decrypt.dokumenTambahan,
                reportId: Decrypt.reportId
            }
        }

        next();
    } catch (error) {
        console.log(error,"error formatDataDokumenTambahan")

        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
} 

const formatDataDokumenPelabuhan = (req, res, next) => {
    console.log("formatDataDokumenPelabuhan")

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
        console.log(error,"error formatDataDokumenPelabuhan")
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data")
    }
}

const formatDataDokumenKapal = (req, res, next) => {
    console.log("formatDataDokumenKapal")

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
        console.log(error,"error formatDataDokumenKapal")
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan data");
    }
}

const formatDataDokumenIdentitasBarang = (req, res, next) => {
    console.log("formatDataDokumenIdentitasBarang")

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
        console.log(error,"error formatDataDokumenIdentitasBarang")

        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenPenjualBarang = (req, res, next) => {
    console.log("formatDataDokumenPenjualBarang")

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
        console.log(error,"error formatDataDokumenPenjualBarang")
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data")
    }
} 

const formatDataDokumenPengirimBarang = (req, res, next) => {
    console.log("formatDataDokumenPengirimBarang")

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
        console.log(error,"error formatDataDokumenPengirimBarang")

        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenPengusahaPLB = (req, res, next) => {
    console.log("formatDataDokumenPengusahaPLB")

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
        console.log(error,"error formatDataDokumenPengusahaPLB")
        
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenPembeliBarang = (req, res, next) => {
    console.log("formatDataDokumenPembeliBarang")

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
        console.log(error,"error formatDataDokumenPembeliBarang")

        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenPpjk = (req, res, next) => {
    console.log("formatDataDokumenPpjk")

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
    console.log("formatDataDokumenMataUang")

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
        console.log(error,"error formatDataDokumenMataUang")
        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data")
    }
}

const formatDataDokumenDataPengangkutan = (req, res, next) => {
    console.log("formatDataDokumenDataPengangkutan")

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
        console.log(error,"error formatDataDokumenDataPengangkutan")

        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenBeratDanVolume = (req, res, next) => {
    console.log("formatDataDokumenBeratDanVolume")

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
        console.log(error,"error formatDataDokumenBeratDanVolume")

        return errorResponse(res, Http.badRequest, "Gagal Menyimpan Data");
    }
}

const formatDataDokumenTempatPenimbunan = (req, res, next) => {
    console.log("formatDataDokumenTempatPenimbunan")

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
        console.log(error,"error formatDataDokumenTempatPenimbunan")

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
    formatDataDokumenPembeliBarang,
    formatDataDokumenPengusahaPLB,
    formatDataDokumenPpjk,
    formatDataDokumenMataUang,
    formatDataDokumenDataPengangkutan,
    formatDataDokumenBeratDanVolume,
    formatDataDokumenTempatPenimbunan
}