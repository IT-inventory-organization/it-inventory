const { body } = require('express-validator');
const Http = require('../../helper/Httplib');
const { createReport } = require('../../helper/DataReport');
const { createDataPengajuan } = require('../../helper/DataPengajuan');
const { createReportIdentitasPenerima } = require('../../helper/IdentitasPenerima');
const { createReportIdentitasPengirim } = require('../../helper/IdentitasPengirim');
const { createReportTransaksiPerdagangan } = require('../../helper/TransaksiPerdagangan');
const { errorResponse, successResponse } = require('../../helper/Response');
const { validationResponse } = require('../../middlewares/validationResponse');
const {
    dataPengajuan,
    identitasPenerima,
    identitasPengirim,
    transaksiPerdagangan,
    dataPengangkut,
    dataPelabuhanMuatBongkar,
    beratDanVolume,
    dataPetiKemasDanPengemas,
    dataPerkiraanTanggalPengeluaran,
    dataTempatPenimbunan
} = require('../../helper/bundleDataReportHeader');

const sequelize = require('../../configs/database')
const {
    validationDataPengajuan, 
    validationIdentitasPengirim, 
    validationIdentitasPenerima,
    validationTransaksiPerdagangan,
    validationDataPengangkutan,
    validationDataPelabuhanMuatBongkar,
    validationBeratDanVolume,
    validationDataPetiKemasDanPengemas,
    validationDataPerkiraanTanggalPengeluaran,
    validationDataTempatPenimbunan
} = require('../../middlewares/validationDataHeader');

const { validationArrListDokumen, validationPetiKemas } = require('../../middlewares/validationDataLanjutan');
const { dataBarang } = require('../../helper/bundleDataBarang');
const { dataDokumen, petiKemas } = require('../../helper/bundleDataLanjutan');
const { createDataPengangkutan } = require('../../helper/DataPengangkutan');
const { createDataPelabuhanMuatBongkar } = require('../../helper/DataPelabuhanMuatBongkar');
const { createDataBeratDanVolume } = require('../../helper/DataBeratDanVolume');
const { createDataPetiKemasDanPengemas } = require('../../helper/DataPetiKemasDanPengemas');
const { createDataTempatPenimbunan } = require('../../helper/DataTempatPenimbunan');
const { createPerkiraanTanggalPengeluaran } = require('../../helper/DataPerkiraanTanggalPengeluaran');
const { createListDokumen } = require('../../helper/ListDokumen');
const { createDataPetiKemas } = require("../../helper/DataPetiKemas");
const { createListBarang } = require("../../helper/ListBarang");
const { validationArrListBarang }= require("../../middlewares/validationDataBarang");
const authentication = require('../../middlewares/authentication');
const Encryption = require('../../helper/encription');
const { createUserActivity } = require('../../helper/UserActivity');

const validationReport = [
    body('pengajuanSebagai').trim().notEmpty().withMessage(`"Pengajuan Sebagai" Is Required`),
    body('kantorPengajuan').trim().notEmpty().withMessage(`"Kantor Pengajuan" Is Required`),
    body('jenisPemberitahuan').trim().notEmpty().withMessage(`"Jenis Pemberitahuan" Is Required`),
    body('jenisKeluar').trim().notEmpty().withMessage(`"Jenis Keluar" Is Required`),
    body('typeReport').trim().notEmpty().withMessage(`"Tipe Report" is Required`),
    body('BCDocumentType').trim().notEmpty().withMessage(`"Jenis Dokumen BC" Is Required`)
];

const addReport = async (req, res) => {
    try {
        const dataObj = {
            pengajuanSebagai: req.body.pengajuanSebagai,
            kantorPengajuan: req.body.kantorPengajuan,
            jenisPemberitahuan: req.body.jenisPemberitahuan,
            jenisKeluar: req.body.jenisKeluar,
            userId: req.currentUser,
            typeReport: req.body.typeReport,
            BCDocumentType: req.body.BCDocumentType,
            isDelete: false
        };

        const result = await createReport(dataObj, null);
        const dataReturn = {
            reportId: result.id,
            userId: result.userId
        };

        if(req.currentRole !== "Owner"){
            await createUserActivity(req.currentUser, result.id, "Create New Report");
        }

        return successResponse(res, Http.created, "Success Adding A Report", dataReturn)
    } catch (error) {
        console.error(error)
        return errorResponse(res, Http.internalServerError, "Failed To Add A Report", error);
    }
}

// Callback Add Data Header
const addDataHeader = async (req, res) => {
    let transaction

    try {
        transaction = await sequelize.transaction();

        const { DataToInput: {pengajuan, identitasPenerima, identitasPengirim, transaksiPerdagangan, pengangkutan, pelabuhanMuatBongkar, beratDanVolume, petiKemasDanPengemas, tempatPenimbunan, perkiraanTanggalPengeluaran}} = req;
        
        const dataPengajuan = await createDataPengajuan(pengajuan, transaction); // Simpan Ke Table Data Pengajuan
        const identitasPenerimaResult = await createReportIdentitasPenerima(identitasPenerima, transaction); // Simpan Ke Table Identitas Penerima
        const identitasPengirimResult = await createReportIdentitasPengirim(identitasPengirim, transaction); // Simpan Ke Table Identitas Pengirim
        const transaksiPerdaganganResult = await createReportTransaksiPerdagangan(transaksiPerdagangan, transaction); // Simpan Ke Table Transaksi Perdagangan
        
        const pengangkutanResult = await createDataPengangkutan(pengangkutan, transaction);
        const pelabuhanMuatBongkarResult = await createDataPelabuhanMuatBongkar(pelabuhanMuatBongkar, transaction);
        const beratDanVolumeResult = await createDataBeratDanVolume(beratDanVolume, transaction);
        const petiKemasDanPengemasResult = await createDataPetiKemasDanPengemas(petiKemasDanPengemas, transaction);
        const tempatPenimbunanResult = await createDataTempatPenimbunan(tempatPenimbunan, transaction);
        const perkiraanTanggalResult = await createPerkiraanTanggalPengeluaran(perkiraanTanggalPengeluaran, transaction);

        const dataToReturn = {
            dataPengajuanId: dataPengajuan.id,
            reportId: dataPengajuan.reportId,
            identitasPenerimaId: identitasPenerimaResult.id,
            identitasPengirimId: identitasPengirimResult.id,
            transaksiPerdaganganId: transaksiPerdaganganResult.id,
            pengangkutanId: pengangkutanResult.id,
            pelabuhanMuatBongkarId: pelabuhanMuatBongkarResult.id,
            beratDanVolumeId: beratDanVolumeResult.id,
            petiKemasDanPengemasId: petiKemasDanPengemasResult.id,
            tempatPenimbunanId: tempatPenimbunanResult.id,
            perkiraanTanggalId: perkiraanTanggalResult.id
        };

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, dataPengajuan.reportId, `Create Report "Data Header"`);
        }

        await transaction.commit();

        return successResponse(res, Http.created, "Success Adding Data Header", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        // console.error(error.message);
        return errorResponse(res, Http.internalServerError, "Failed To Add Data", error)
    }
}

// Callback Add Data Lanjutan
const addDataLanjutan = async (req, res) => {
    let transaction

    try {
        transaction = await sequelize.transaction();

        const { DataToInput: {listDokumen, petiKemas}} = req;
        
        const promises = [];

        for (let i = 0; i < listDokumen.length; i++) {
            let result = await createListDokumen(listDokumen[i], transaction);
            promises.push(result)
            
        }
        const petiKemasResult = await createDataPetiKemas(petiKemas, transaction)

        const dataToReturn = {
            listDokumen: promises.map(el => el.id),
            reportId: petiKemas.reportId,
            petiKemas: petiKemasResult.id,
        };

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, petiKemas.reportId, `Create Report "Data Lanjutan"`);
        }

        await transaction.commit();

        return successResponse(res, Http.created, "Success Adding Data Lanjutan", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Failed To Add Data", error)
    }
}

// Callback Add Data Barang
const addDataBarang = async (req, res) => {
    let transaction
    
    try {
        transaction = await sequelize.transaction();
        const { DataToInput: {listBarang, reportId}} = req;

        
        const promises = [];
        // listBarang.forEach(async el => {
        //     promises.push(await createListBarang(el, transaction));
        // })

        // const result = await Promise.all(promises);
        // Loop Dengan Async
        for (let index = 0; index < listBarang.length; index++) {
            let res = await createListBarang(listBarang[index], transaction);
            promises.push(res);
        }
        
        const dataToReturn = {
            listBarang: promises.map( ele => ele.id),
            reportId: reportId,
        };

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, listBarang[0].reportId, `Create Report "Data Barang"`);
        }

        await transaction.commit()

        return successResponse(res, Http.created, "Success Adding List Barang", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        
        return errorResponse(res, Http.internalServerError, "Failed To Add Data", error)
    }
}

/**
 * Testing Purpose 
 */
const decrypt = async(req, res) => {
    res.json(
        Encryption.AESDecrypt(req.body.tes)
    )
}

module.exports = (routes) => {
    // Create report
    routes.post('/', // --> url
        authentication,
        validationReport,
        validationResponse,
        addReport
    );

    // Create Data Header
    routes.post('/data-header',
        authentication,
        validationDataPengajuan,
        validationIdentitasPengirim,
        validationIdentitasPenerima,
        validationTransaksiPerdagangan,
        validationDataPengangkutan,
        validationDataPelabuhanMuatBongkar,
        validationBeratDanVolume,
        validationDataPetiKemasDanPengemas,
        validationDataTempatPenimbunan,
        validationDataPerkiraanTanggalPengeluaran,
        validationResponse, // --> Middleware
        dataPengajuan,
        identitasPengirim,
        identitasPenerima,
        transaksiPerdagangan,
        dataPengangkut,
        dataPelabuhanMuatBongkar,
        beratDanVolume,
        dataPetiKemasDanPengemas,
        dataTempatPenimbunan,
        dataPerkiraanTanggalPengeluaran,
        addDataHeader
    );

    // Create Data Lanjutan
    routes.post('/data-lanjutan',
        authentication,
        validationArrListDokumen,
        validationPetiKemas,
        validationResponse,
        dataDokumen,
        petiKemas,
        addDataLanjutan
    );

    // Create Data Barang
    routes.post('/data-barang',
        authentication,
        validationArrListBarang,
        validationResponse,
        dataBarang,
        addDataBarang
    );
    
    /**
     * Testign purpose
     * Check Hasil Decrypt
     */
    routes.post('/test', decrypt);
}