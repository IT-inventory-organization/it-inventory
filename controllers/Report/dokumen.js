const { errorResponse, successResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');
const { 
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
    formatDataDokumenTempatPenimbunan,
    formatDataDokumenBeratDanVolume,
    formatDataDokumenPembeliBarang
} = require('../../middlewares/dataDokumenMiddleware/reformatDataDokumen');
const { 
    vDataPengajuan, 
    vDataTambahan, 
    vDataPelabuhan, 
    vDataKapal,
    vIdentitasBarang,
    vPenjualBarang,
    vPengirimBarang,
    vPengusahaPLB,
    vPpjk,
    vMataUang,
    vDataPengangkutan,
    vBeratDanVolume,
    vTempatPenimbunan
} = require('../../middlewares/dataDokumenMiddleware/validationDataDokumen');
const { validationResponse } = require('../../middlewares/validationResponse');
const { saveDataPengajuan } = require('../../helper/Repository/dataPengajuan');
const sequelize = require('../../configs/database');
const authentication = require('../../middlewares/authentication');
const { saveDataTambahan } = require('../../helper/Repository/dataTambahan');
const { saveDataPelabuhan } = require('../../helper/Repository/dataPelabuhan');
const { saveDataKapal } = require('../../helper/Repository/dataKapal');
const { saveIdentitasBarang } = require('../../helper/Repository/identitasBarang');
const { savePenjualBarang } = require('../../helper/Repository/penjualBarang');
const { savePengirimBarang } = require('../../helper/Repository/pengirmBarang');
const { savePengusahaPLB } = require('../../helper/Repository/pengusahaPLB');
const { saveDataPpjk } = require('../../helper/Repository/dataPpjk');
const { saveMataUang } = require('../../helper/Repository/mataUang');
const { saveDataPengangkutan } = require('../../helper/Repository/dataPengangkutan');
const { saveTempatPenimbunan } = require('../../helper/Repository/tempatPenimbunan');
const { saveBeratDanVolume } = require('../../helper/Repository/beratDanVolume');
const { saveAktifitas } = require('../../helper/saveAktifitas');
const { authorizationReport } = require('../../helper/authorization');
const { savePembeliBarang } = require('../../helper/Repository/pembeliBarang');

const saveDokumenPemasukan = async(req, res) => {
    let transaction;
    // return;
    try {
        const {ref} = req.body;
        // console.log(ref);return;

        transaction = await sequelize.transaction();
        // let resultSaved = [];
        /**
         * TODO: Tinggal Membuat Create Berat Dan Volume, dan Tempat Penimbunan, Tambah Aktifitas User
         */
        const resultDataPemasukan = await saveDataPengajuan(ref.dataPemasukan, transaction);
        const resultDataTambahan = await saveDataTambahan(ref.dataTambahan, transaction);
        const resultDataPelabuhan = await saveDataPelabuhan(ref.dataPelabuhan, transaction);
        const resultDataKapal = await saveDataKapal(ref.dataKapal, transaction);
        const resultIdentitasBarang = await saveIdentitasBarang(ref.identitasBarang, transaction);
        const resultPenjualBarang = await savePenjualBarang(ref.penjualBarang, transaction);
        const resultPengirimBarang = await savePengirimBarang(ref.pengirimBarang, transaction);
        const resultPembeliBarang = await savePembeliBarang(ref.pembeliBarang, transaction);
        const resultPengusahaPLB = await savePengusahaPLB(ref.pengusahaPLB, transaction);
        const resultPpjk = await saveDataPpjk(ref.ppjk, transaction);
        const resultMataUang = await saveMataUang(ref.mataUang, transaction);
        const resultDataPengangkutan = await saveDataPengangkutan(ref.dataPengangkutan, transaction);
        const reusltBeratDanVolume = await saveBeratDanVolume(ref.beratDanVolume, transaction);
        const resultTempatPenimbunan = await saveTempatPenimbunan(ref.tempatPenimbunan, transaction);
        /**
         * 
         */
        
        const data = {
            dataPengajuan: resultDataPemasukan.id,
            dataTambahan: resultDataTambahan.id,
            dataPelabuhan: resultDataPelabuhan.id,
            dataKapal: resultDataKapal.id,
            identitasBarang: resultIdentitasBarang.id,
            penjualBarang: resultPenjualBarang.id,
            pengirimBarang: resultPengirimBarang.id,
            pengusahaPLB: resultPengusahaPLB.id,
            pembeliBarang: resultPembeliBarang.id,
            ppjk: resultPpjk.id,
            mataUang: resultMataUang.id,
            dataPengangkutan: resultDataPengangkutan.id,
            beratDanVolume: reusltBeratDanVolume.id,
            tempatPenimbunan: resultTempatPenimbunan.id
        }
        await transaction.commit();
        if(req.currentRole !== 'Owner'){
            saveAktifitas({userId: req.currentUser, reportId: ref.dataPemasukan.reportId, aktifitas: "Membuat Dokumen PLB Baru"});
        }

        return successResponse(res, Http.created, "Berhasil Menyimpan Data Dokumen", data);
    } catch (error) {
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, error.status, error.message);

    }
}

const updateDokumenPemasukan = async(req,res) => {
    const {idReport} = req.params;
}

module.exports = routes => {
    routes.post('/save/pemasukan',
        authentication,
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
        formatDataDokumenTempatPenimbunan,
        vDataPengajuan,
        vDataTambahan,
        vDataPelabuhan,
        vDataKapal,
        vIdentitasBarang,
        vPenjualBarang,
        vPengirimBarang,
        vPengusahaPLB,
        vPpjk,
        vMataUang,
        vDataPengangkutan,
        vBeratDanVolume,
        vTempatPenimbunan,
        validationResponse, 
        saveDokumenPemasukan
    );

    routes.put('/update/pemasukan/:idReport',
        authentication,
        authorizationReport,
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
        formatDataDokumenTempatPenimbunan,
        vDataPengajuan,
        vDataTambahan,
        vDataPelabuhan,
        vDataKapal,
        vIdentitasBarang,
        vPenjualBarang,
        vPengirimBarang,
        vPengusahaPLB,
        vPpjk,
        vMataUang,
        vDataPengangkutan,
        vBeratDanVolume,
        vTempatPenimbunan,
        validationResponse, 
        updateDokumenPemasukan
    );
}