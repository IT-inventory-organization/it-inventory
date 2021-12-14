const { errorResponse, successResponse } = require('../../helper/Response')
const HHtp = require('../../helper/Httplib');
const {
    formatDataDokumenPengeluaran,
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

const sequelize = require('../../configs/database');
const authentification = require('../../configs/database')
const { validationResponse } = require('../../middlewares/validationResponse');

const {saveDataPengajuan, updateDataPengajuan } = require('../../helper/Repository/dataPengajuan');
const {saveDataTambahan, updateDataTambahan} = require('../../helper/Repository/dataTambahan');
const {saveDataPelabuhan, updateDataPelabuhanRepo} = require('../../helper/Repository/dataPelabuhan');
const {saveDataKapal, updateDataKapalrepo} = require ('../../helper/Repository/dataKapal');
const { saveIdentitasBarang, updateIdentitasBarangRepo } = require('../../helper/Repository/identitasBarang');
const { savePenjualBarang, updatePenjualBarangRepo } = require('../../helper/Repository/penjualBarang');
const { savePengirimBarang, updatePengirimBarangRepo } = require('../../helper/Repository/pengirmBarang');
const { savePengusahaPLB, updatePengusahaPLBRepo } = require('../../helper/Repository/pengusahaPLB');
const { saveDataPpjk, updateDataPpjkRepo } = require('../../helper/Repository/dataPpjk');
const { saveMataUang, updateMataUangRepo } = require('../../helper/Repository/mataUang');
const { saveDataPengangkutan, updateDataPengangkutanRepo } = require('../../helper/Repository/dataPengangkutan');
const { saveTempatPenimbunan, updateTempatPenimbunanRepo } = require('../../helper/Repository/tempatPenimbunan');
const { saveBeratDanVolume, updateBeratDanVolumeRepo } = require('../../helper/Repository/beratDanVolume');
const { saveAktifitas } = require('../../helper/saveAktifitas');
const { authorizationReport } = require('../../helper/authorization');
const { savePembeliBarang, updatePembeliBarangRepo } = require('../../helper/Repository/pembeliBarang');

const saveDokumenPengeluaran = async(req, res) => {
    let transaction;
    //return
    try {
        const {ref} = req.body;
        // console.log(ref);return;

        transaction = await sequelize.transaction();
        // let resultSaved = [];

        const resultDataPengeluaran = await saveDataPengajuan(ref.dokumenPengeluaran, transaction)
        const resultDataPemasukan = await saveDataPengajuan(ref.dokumenPemasukan, transaction);
        const resultDataTambahan = await saveDataTambahan(ref.dokumenTambahan, transaction);
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
        
        if(req.currentRole !== 'Owner'){
            saveAktifitas({userId: req.currentUser, reportId: ref.dokumenPemasukan.reportId, aktifitas: "Membuat Dokumen PLB Baru"});
        }
        await transaction.commit();
        return successResponse(res, Http.created, "Berhasil Menyimpan Data Dokumen", data);
    } catch (error) {
        console.log(error)
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, error.status, error.message);

    }
}
