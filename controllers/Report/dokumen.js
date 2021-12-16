const { errorResponse, successResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');
let jsonxml = require('jsontoxml');
const { 
    formatDataDokumenMasukan,
    formatDataDokumenKeluaran,
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
    vDataPengajuanPengeluaran,
    vDataTambahan,
    vDataPelabuhan,
    vDataKapal,
    vIdentitasBarang,
    vPenjualBarang,
    vPengirimBarang,
    vPengusahaPLB,
    vPembeliBarang,
    vPpjk,
    vMataUang,
    vDataPengangkutan,
    vBeratDanVolume,
    vTempatPenimbunan
} = require('../../middlewares/dataDokumenMiddleware/validationDataDokumen');
const { body, validationResult, matchedData } = require('express-validator');
const { validationResponse } = require('../../middlewares/validationResponse');
const {
    saveDataPengajuan,
    saveDataPengajuanPengeluaran,
    updateDataPengajuan,
    updateDataPengajuanPengeluaran,
    getDataPengajuan,
    getDataPengajuanPengeluaran
} = require('../../helper/Repository/dataPengajuan');
const sequelize = require('../../configs/database');
const authentication = require('../../middlewares/authentication');
const { saveDataTambahan, updateDataTambahan, getDataTambahan } = require('../../helper/Repository/dataTambahan');
const { saveDataPelabuhan, updateDataPelabuhanRepo, getDataPelabuhan } = require('../../helper/Repository/dataPelabuhan');
const { saveDataKapal, updateDataKapalRepo, getDataKapal } = require('../../helper/Repository/dataKapal');
const { saveIdentitasBarang, updateIdentitasBarangRepo, getIdentitasBarang } = require('../../helper/Repository/identitasBarang');
const { savePenjualBarang, updatePenjualBarangRepo, getPenjualBarang } = require('../../helper/Repository/penjualBarang');
const { savePengirimBarang, updatePengirimBarangRepo, getPengirimBarang } = require('../../helper/Repository/pengirmBarang');
const { savePengusahaPLB, updatePengusahaPLBRepo, getPengusahaPLB } = require('../../helper/Repository/pengusahaPLB');
const { saveDataPpjk, updateDataPpjkRepo, getDataPpjk } = require('../../helper/Repository/dataPpjk');
const { saveMataUang, updateMataUangRepo, getMataUang } = require('../../helper/Repository/mataUang');
const { saveDataPengangkutan, updateDataPengangkutanRepo, getDataPengangkutan } = require('../../helper/Repository/dataPengangkutan');
const { saveTempatPenimbunan, updateTempatPenimbunanRepo, getTempatPenimbunan } = require('../../helper/Repository/tempatPenimbunan');
const { saveBeratDanVolume, updateBeratDanVolumeRepo, getBeratDanVolume } = require('../../helper/Repository/beratDanVolume');
const { saveAktifitas } = require('../../helper/saveAktifitas');
const { authorizationReport } = require('../../helper/authorization');
const { savePembeliBarang, updatePembeliBarangRepo, getPembeliBarang } = require('../../helper/Repository/pembeliBarang');
const { getDataBarang } = require('../../helper/Repository/dataBarang');
const { updateDataPO } = require('../../helper/Repository/dataPO');
const DokumenPengeluaran = require('../../database/models/dokumen_pengeluaran');
const DokumenPemasukan = require('../../database/models/dokumen_pemasukan');
const Report = require('../../database/models/report');

const saveDokumenPemasukan = async(req, res) => {
    let transaction;
    // return;
    try {
        const {ref} = req.body;
        // console.log(ref,"REF");

        transaction = await sequelize.transaction();
        // let resultSaved = [];

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
        console.log(error,"<<<<<<<<<<<<")
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, error.status, error.message);

    }
}

const updateDokumenPemasukan = async(req,res) => {
    const {idReport} = req.params;
    let transaction
    try {
        const {ref} = req.body;
        transaction = await sequelize.transaction();

        const updateDokumenPemasukan = await updateDataPengajuan(ref.dokumenPemasukan, idReport, transaction)
        const updateDokumenTambahan = await updateDataTambahan(ref.dokumenTambahan, idReport, transaction);
        const updateDataPelabuhan = await updateDataPelabuhanRepo(ref.dataPelabuhan, idReport, transaction);
        const updateDataKapal = await updateDataKapalRepo(ref.dataKapal, idReport, transaction);
        const updateIdentitasBarang = await updateIdentitasBarangRepo(ref.identitasBarang, idReport, transaction);
        const updatePenjualBarang = await updatePenjualBarangRepo(ref.penjualBarang, idReport, transaction);
        const updatePengirimBarang = await updatePengirimBarangRepo(ref.pengirimBarang, idReport, transaction);
        const updatePengusahaPLB = await updatePengusahaPLBRepo(ref.pengusahaPLB, idReport, transaction);
        const updatePembeliBarang = await updatePembeliBarangRepo(ref.pembeliBarang, idReport, transaction);
        // const updatePengusahaPLB = await updatePengusahaPLBRepo(ref.pengusahaPLB, idReport, transaction);
        const updateDataPpjk = await updateDataPpjkRepo(ref.ppjk, idReport, transaction);
        const updateMataUang = await updateMataUangRepo(ref.mataUang, idReport, transaction);
        const updateDataPengangkutan = await updateDataPengangkutanRepo(ref.dataPengangkutan, idReport, transaction);
        const updateBeratDanVolume = await updateBeratDanVolumeRepo(ref.beratDanVolume, idReport, transaction);
        const updateTempatPenimbunan = await updateTempatPenimbunanRepo(ref.tempatPenimbunan, idReport, transaction);

        const updatedData = {
            dokumenPemasukan: updateDokumenPemasukan.id,
            dokumenTambahan: updateDokumenTambahan.id,
            dataPelabuhan: updateDataPelabuhan.id,
            dataKapal: updateDataKapal.id,
            identitasBarang: updateIdentitasBarang.id,
            penjualBarang: updatePenjualBarang.id,
            pengirimBarang: updatePengirimBarang.id,
            pengusahaPLB: updatePengusahaPLB.id,
            pembeliBarang: updatePembeliBarang.id,
            pengusahaPLB: updatePengusahaPLB.id,
            ppjk: updateDataPpjk.id,
            mataUang: updateMataUang.id,
            updatePengangkutan: updateDataPengangkutan.id,
            updateBeratDanVolume: updateBeratDanVolume.id,
            updateTempatPenimbunan: updateTempatPenimbunan.id
        }

        if(req.currentRole !== 'Owner'){
            saveAktifitas({userId: req.currentUser, reportId: idReport, aktifitas: "Update Aktifitas Report"});
        }

        await transaction.commit();

        return successResponse(res, Http.created, "Berhasil Update Report", updatedData)
    } catch (error) {
        console.log(error)
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, error.status, error.message);
    }
}


const getDokumenPengeluaran = async(req, res) => {
    try {
        let query = {};
        const dokumenPengeluaran = await DokumenPengeluaran.findAll({
            attributes: ['id','reportId',
                'nomorDokumenPemasukan','tanggalDokumenPemasukan'],
            include: [
                {
                    model:Report,
                    where: {
                        userId: req.currentUser
                    },
                    attributes: []
                }
            ]
        });

        return successResponse(res, Http.ok, "Success", dokumenPengeluaran, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}
const getDokumenPemasukan = async(req, res) => {
    try {
        let query = {};
        const dokumenpemasukan = await DokumenPemasukan.findAll({
            attributes: ['id','reportId',
                'nomorDokumenPemasukan','tanggalDokumenPemasukan'],
            include: [
                {
                    model:Report,
                    where: {
                        userId: req.currentUser
                    },
                    attributes: []
                }
            ]
        });

        return successResponse(res, Http.ok, "Success", dokumenpemasukan, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const formatSavePengeluaran = [
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
    // formatDataDokumenTempatPenimbunan,
];

let validateSavePengeluaran = [
    vDataPengajuanPengeluaran,
    vDataTambahan,
    vDataPelabuhan,
    vDataKapal,
    vIdentitasBarang,
    vPenjualBarang,
    vPengirimBarang,
    vPengusahaPLB,
    vPembeliBarang,
    vPpjk,
    vMataUang,
    vDataPengangkutan,
    vBeratDanVolume
];

const saveDokumenPengeluaran = async(req, res) => {
    let transaction;
    try {
        const { ref } = matchedData(req);

        transaction = await sequelize.transaction();

        const resultDataPengeluaran = await saveDataPengajuanPengeluaran(ref.dokumenPengeluaran, transaction);
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

        const data = {
            dataPengajuan: resultDataPengeluaran.id,
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
            beratDanVolume: reusltBeratDanVolume.id
        }
        
        if (req.currentRole !== 'Owner') {
            saveAktifitas({
                userId: req.currentUser,
                reportId: ref.dokumenPengeluaran.reportId,
                aktifitas: "Membuat Dokumen PLB Baru (Pengeluaran)"
            });
        }
        await transaction.commit();
        return successResponse(res, Http.created, "Berhasil Menyimpan Data Dokumen Pengeluaran", data, false);
    } catch (error) {
        console.error(error)
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, error.status, error.message);

    }
}

let validateUpdatePengeluaran = [
    vDataPengajuanPengeluaran,
    vDataTambahan,
    vDataPelabuhan,
    vDataKapal,
    vIdentitasBarang,
    vPenjualBarang,
    vPengirimBarang,
    vPengusahaPLB,
    vPembeliBarang,
    vPpjk,
    vMataUang,
    vDataPengangkutan,
    vBeratDanVolume
];

const updateDokumenPengeluaran = async(req, res) => {
    const { idReport } = req.params;
    let transaction;
    try {
        const { ref } = matchedData(req);
        transaction = await sequelize.transaction();

        const updateDokumenPengeluaran = await updateDataPengajuanPengeluaran(ref.dokumenPengeluaran, idReport, transaction)
        const updateDokumenTambahan = await updateDataTambahan(ref.dokumenTambahan, idReport, transaction);
        const updateDataPelabuhan = await updateDataPelabuhanRepo(ref.dataPelabuhan, idReport, transaction);
        const updateDataKapal = await updateDataKapalRepo(ref.dataKapal, idReport, transaction);
        const updateIdentitasBarang = await updateIdentitasBarangRepo(ref.identitasBarang, idReport, transaction);
        const updatePenjualBarang = await updatePenjualBarangRepo(ref.penjualBarang, idReport, transaction);
        const updatePengirimBarang = await updatePengirimBarangRepo(ref.pengirimBarang, idReport, transaction);
        const updatePengusahaPLB = await updatePengusahaPLBRepo(ref.pengusahaPLB, idReport, transaction);
        const updatePembeliBarang = await updatePembeliBarangRepo(ref.pembeliBarang, idReport, transaction);
        // const updatePengusahaPLB = await updatePengusahaPLBRepo(ref.pengusahaPLB, idReport, transaction);
        const updateDataPpjk = await updateDataPpjkRepo(ref.ppjk, idReport, transaction);
        const updateMataUang = await updateMataUangRepo(ref.mataUang, idReport, transaction);
        const updateDataPengangkutan = await updateDataPengangkutanRepo(ref.dataPengangkutan, idReport, transaction);
        const updateBeratDanVolume = await updateBeratDanVolumeRepo(ref.beratDanVolume, idReport, transaction);
        const updatedData = {
            dokumenPengeluaran: updateDokumenPengeluaran.id,
            dokumenTambahan: updateDokumenTambahan.id,
            dataPelabuhan: updateDataPelabuhan.id,
            dataKapal: updateDataKapal.id,
            identitasBarang: updateIdentitasBarang.id,
            penjualBarang: updatePenjualBarang.id,
            pengirimBarang: updatePengirimBarang.id,
            pengusahaPLB: updatePengusahaPLB.id,
            pembeliBarang: updatePembeliBarang.id,
            pengusahaPLB: updatePengusahaPLB.id,
            ppjk: updateDataPpjk.id,
            mataUang: updateMataUang.id,
            updatePengangkutan: updateDataPengangkutan.id,
            updateBeratDanVolume: updateBeratDanVolume.id
        }

        if (req.currentRole !== 'Owner'){
            saveAktifitas({
                userId: req.currentUser,
                reportId: idReport,
                aktifitas: "Update Aktifitas Report (Pengeluaran)"
            });
        }

        await transaction.commit();

        return successResponse(res, Http.created, "Berhasil Update Report Pengeluaran", updatedData, false);
    } catch (error) {
        console.error(error)
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, error.status, error.message);

    }
}

const detailDokumenPemasukan = async(req, res) => {
    try {
        const { reportId } = req.params;
        const data = {
            dataPengajuan: await getDataPengajuan(reportId),
            dataTambahan: await getDataTambahan(reportId),
            dataPelabuhan: await getDataPelabuhan(reportId),
            dataKapal: await getDataKapal(reportId),
            identitasBarang: await getIdentitasBarang(reportId),
            penjualBarang: await getPenjualBarang(reportId),
            pengirimBarang: await getPengirimBarang(reportId),
            pengusahaPLB: await getPengusahaPLB(reportId),
            pembeliBarang: await getPembeliBarang(reportId),
            ppjk: await getDataPpjk(reportId),
            mataUang: await getMataUang(reportId),
            dataPengangkutan: await getDataPengangkutan(reportId),
            beratDanVolume: await getBeratDanVolume(reportId),
            tempatPenimbunan: await getTempatPenimbunan(reportId),
            dataBarang: await getDataBarang(reportId)
        };

        if (req.accepts('xml')) {
            res.type('application/xml');
            const xmlData = jsonxml(JSON.parse(JSON.stringify(data)), true);
            return res.status(200).send(xmlData);
        }

        return successResponse(res, Http.created, "Sukses", data, false);
    } catch (error) {
        return errorResponse(res, error.status, error.message);
    }
}

const detailDokumenPengeluaran = async(req, res) => {
    try {
        const { reportId } = req.params;
        const data = {
            dataPengajuan: await getDataPengajuanPengeluaran(reportId),
            dataTambahan: await getDataTambahan(reportId),
            dataPelabuhan: await getDataPelabuhan(reportId),
            dataKapal: await getDataKapal(reportId),
            identitasBarang: await getIdentitasBarang(reportId),
            penjualBarang: await getPenjualBarang(reportId),
            pengirimBarang: await getPengirimBarang(reportId),
            pengusahaPLB: await getPengusahaPLB(reportId),
            pembeliBarang: await getPembeliBarang(reportId),
            ppjk: await getDataPpjk(reportId),
            mataUang: await getMataUang(reportId),
            dataPengangkutan: await getDataPengangkutan(reportId),
            beratDanVolume: await getBeratDanVolume(reportId),
            dataBarang: await getDataBarang(reportId)
        };

        if (req.accepts('xml')) {
            res.type('application/xml');
            const xmlData = jsonxml(JSON.parse(JSON.stringify(data)), true);
            return res.status(200).send(xmlData);
        }

        return successResponse(res, Http.created, "Sukses", data, false);
    } catch (error) {
        return errorResponse(res, error.status, error.message);
    }
}

const updatePO = async(req, res) => {
    const { reportId } = req.params;
    let transaction;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const { po } = matchedData(req);
        transaction = await sequelize.transaction();
        const query = {
            where: { id: { in: po } }
        }
        const update = await updateDataPO({ reportId: reportId }, query, transaction);
        const data = {
            dataPO: update
        }

        if (req.currentRole !== 'Owner') {
            saveAktifitas({
                userId: req.currentUser,
                reportId: reportId,
                aktifitas: "Update Aktifitas Report (Pilih PO)"
            });
        }

        await transaction.commit();

        return successResponse(res, Http.created, "Berhasil Update Report PO", data, false);
    } catch (error) {
        console.log(error);
        if (transaction) await transaction.rollback();
        return errorResponse(res, error.status, error.message);
    }
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
        updateDokumenPemasukan
    );

    routes.get('/list/pengeluaran',
        authentication,
        getDokumenPengeluaran
    );
    routes.get('/list/pemasukan',
        authentication,
        getDokumenPemasukan
    );

    routes.post('/save/pengeluaran',
        authentication,
        ...validateSavePengeluaran,
        validationResponse,
        saveDokumenPengeluaran
    );

    routes.post('/update/pengeluaran/:idReport',
        authentication,
        ...validateUpdatePengeluaran,
        validationResponse,
        updateDokumenPengeluaran
    );

    routes.get('/preview/pemasukan/:reportId',
        authentication,
        detailDokumenPemasukan
    );

    routes.get('/preview/pengeluaran/:reportId',
        authentication,
        detailDokumenPengeluaran
    );

    routes.post('/update/po/:reportId',
        authentication,
        body('po')
            .notEmpty().withMessage('Tidak boleh kosong')
            .isArray().withMessage('Harus berupa array'),
        body('po.*')
            .isNumeric().withMessage('Isi dengan angka'),
        updatePO
    );
}



const getPLB = async (req, pageSize, pageNo, sortBy, searchQuery = null, type = null, status = null) => {
    try {
        let searchUser = 'AND';
        let qtSearch = '';
        let orderQuery = '';
        let typeQuery = '';
        let statusQuery = '';
        const limit = pageSize ? +pageSize : 10
        const offset = pageNo ? (+pageNo - 1) * pageSize : 0

        switch (sortBy) {
            case "oldest":
                orderQuery+=`ORDER BY "RP"."createdAt" ASC`;
                break;
            default: 
                orderQuery+=`ORDER BY "RP"."createdAt" DESC`;
                break;
        }
 
        if(req.currentRole !== "Admin" && req.currentRole !== "Owner") { // Jika User
            searchUser+=`"RP"."userId" = ${req.currentUser}`;
        }

        if(searchQuery != null){
            if(req.currentRole !== "Admin" && req.currentRole !== "Owner"){
                qtSearch+=`AND `;
            }
            qtSearch+=`("RP"."typeReport"||' '||"RP"."BCDocumentType" ILIKE '%${searchQuery}%' OR "RP"."id"::text ILIKE '%${searchQuery}%' OR TO_CHAR("RP"."createdAt", 'dd-mm-yyyy HH24:MI:ss')::text ILIKE '%${searchQuery}%' OR "US"."id"::text ILIKE '%${searchQuery}%' OR TO_CHAR("US"."createdAt", 'dd-mm-yyyy') ILIKE '%${searchQuery}%' OR "IPG"."namaPengirim" ILIKE '%${searchQuery}%' OR ip."namaPPJK" ILIKE '%${searchQuery}%' OR "RP".status::text ILIKE '%${searchQuery}%' OR "RP"."nomorAjuan"::text ILIKE '%${searchQuery}%')`;
        }

        if(type != null){
            if((req.currentRole !== 'Admin' && req.currentRole !== 'Owner') || searchQuery != null){
                typeQuery+=`AND `
            }
            typeQuery+=`"RP"."typeReport" = '${type}'`;
        }
        if(status != null){
            if((req.currentRole !== 'Admin' && req.currentRole !== 'Owner') || searchQuery != null || type != null){
                statusQuery+=`AND `
            }
            if(status == 'All'){
                statusQuery += `"RP".status IS NOT NULL`;  
            }else if(status == 'Approval'){
                statusQuery += `"RP".status IS NULL`;
            }else{
                statusQuery += `"RP".status = '${status}'`;
            }
        }

        if(req.currentRole === "Admin" || req.currentRole === "Owner"){
            if(searchQuery == null){
                if(type == null){
                    if(status == null){
                        searchUser=' '; // Membuang AND
                    }
                }
            }
        }

        // const res = await sequelize.query(`SELECT "RP".id as id, "RP"."typeReport"||' '||"RP"."BCDocumentType" as "jenisInventory", "RP"."nomorAjuan" as "nomorAjuan", TO_CHAR("RP"."createdAt", 'dd-mm-yyyy HH24:MI:ss') as "tanggalAjuan", "IPG"."namaPengirim" as pengirim, ip."namaPPJK" as penerima, "RP".status as jalur, "RP"."isEditable" as edit FROM "Reports" as "RP" LEFT OUTER JOIN "Users" as "US" ON ("RP"."userId" = "US"."id") LEFT OUTER JOIN "IdentitasPengirim" as "IPG" ON ("RP"."id" = "IPG"."reportId") LEFT OUTER JOIN "IdentitasPPJK" as ip ON ("RP"."id" = ip."reportId") WHERE "RP"."isDelete" = false ${searchUser} ${statusQuery} ${qtSearch} ${typeQuery} ${orderQuery} LIMIT ${limit} OFFSET ${offset}`);

        const res = await sequelize.query(
            `SELECT 
            "report".jenisPemberitahuan as jenisPemberitahuan, 
            "report"."typeReport"||' '||"report"."jenisDokumenBC" as "jenis Dokumen", 
            "report"."id" as "Nomor Dokumen", 
            TO_CHAR("RP"."createdAt", 'dd-mm-yyyy HH24:MI:ss') as "Tanngal", "IPG"."namaPengirim" as pengirim, ip."namaPPJK" as penerima, "RP".status as jalur, "RP"."isEditable" as edit FROM "Reports" as "RP" LEFT OUTER JOIN "Users" as "US" ON ("RP"."userId" = "US"."id") LEFT OUTER JOIN "IdentitasPengirim" as "IPG" ON ("RP"."id" = "IPG"."reportId") LEFT OUTER JOIN "IdentitasPPJK" as ip ON ("RP"."id" = ip."reportId") WHERE "RP"."isDelete" = false ${searchUser} ${statusQuery} ${qtSearch} ${typeQuery} ${orderQuery} LIMIT ${limit} OFFSET ${offset}`);

        const resCount = await sequelize.query(`SELECT count(*) FROM "Reports" as "RP" LEFT OUTER JOIN "Users" as "US" ON ("RP"."userId" = "US".id) LEFT OUTER JOIN "IdentitasPengirim" as "IPG" ON ("RP".id = "IPG"."reportId") LEFT OUTER JOIN "IdentitasPPJK" as ip ON ("RP".id = ip."reportId") WHERE "RP"."isDelete" = false ${searchUser} ${statusQuery} ${qtSearch} ${typeQuery} GROUP BY "RP"."createdAt" ${orderQuery}`);

        const data = {
            data: res[0],
            data_size: +countTotal(resCount[0]),
            page_size: +pageSize,
            page: +pageNo || 1
        }

        return data;
    } catch (error) {
        throw error
    }
}

<<<<<<< HEAD
module.exports = {
    getPLB
}

// const getAllPO = async (req, pageSize, pageNo, sortBy, searchQuery = null, type = null, status = null) => {
//     try {
//         let searchUser = 'AND';
//         let qtSearch = '';
//         let orderQuery = '';
//         let typeQuery = '';
//         let statusQuery = '';
//         const limit = pageSize  ? +pageSize : 10
//         const offset = pageNo ? (+pageNo - 1) * pageSize : 0

//         switch (sortBy){
//             case 'oldest':
//                 orderQuery+=`ORDER BY "RP"."createdAt ASC`;
//                 break;
//             default:
//                 orderQuery+=`ORDER BY "RP"."createdAt DESC`;
//                 break;
//         }

//         if(req.currentRole !== "Admin" && req.currentRole !== "Owner") {
//             searchUser+=`"RP"."userId" = ${req.currentUser}`;
//         }

//         if(searchQuery != null){
//             if(req.currentRole !== "Admin" && req.currentRole !== "Owner"){
//                 qtSearch+=`AND `;
//             }
//             qtSearch+=`("RP".")`
//         }

//     }
// }
=======
// module.exports = {
//     getPLB
// }
>>>>>>> d37eeb43983f90a527411d5965ee82c490b1f41f
