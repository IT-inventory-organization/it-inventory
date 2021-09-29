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
    transaksiPerdagangan
} = require('../../helper/bundleDataReportHeader');

const sequelize = require('../../configs/database')
const {
    validationDataPengajuan, 
    validationIdentitasPengirim, 
    validationIdentitasPenerima,
    validationTransaksiPerdagangan
} = require('../../middlewares/validationReportInput');
const { createDataPengangkutan } = require('../../helper/DataPengangkutan');
const { createDataPelabuhanMuatBongkar } = require('../../helper/DataPelabuhanMuatBongkar');
const { createDataBeratDanVolume } = require('../../helper/DataBeratDanVolume');
const { createDataPetiKemasDanPengemas } = require('../../helper/DataPetiKemasDanPengemas');
const { createDataTempatPenimbunan } = require('../../helper/DataTempatPenimbunan');
const { createPerkiraanTanggalPengeluaran } = require('../../helper/DataPerkiraanTanggalPengeluaran');
const { createListDokumen } = require('../../helper/ListDokumen');
const { createDataPetiKemas } = require("../../helper/DataPetiKemas")
const { createListBarang } = require("../../helper/ListBarang")

const validationReport = [
    body('pengajuanSebagai').trim().notEmpty().withMessage(`"Pengajuan Sebagai" Is Required`),
    body('kantorPengajuan').trim().notEmpty().withMessage(`"Kantor Pengajuan" Is Required`),
    body('jenisPemberitahuan').trim().notEmpty().withMessage(`"Jenis Pemberitahuan" Is Required`),
    body('jenisKeluar').trim().notEmpty().withMessage(`"Jenis Keluar" Is Required`),
    body('typeReport').trim().notEmpty().withMessage(`"Tipe Report" is Required`),
    body('BCDocumentType').trim().notEmpty().withMessage(`"Jenis Dokumen BC" Is Required`)
];


/**
 * TODO: Validation, 
 * TODO: Create Report,
 * TODO: Create & Update Data Header(Penganjuan, identitas pengirim & penerima, Tranasksi Perdagangan) 
 * [29/09/2021]
 */
const addReport = async (req, res) => {
    try {

        const dataObj = {
            pengajuanSebagai: req.body.pengajuanSebagai,
            kantorPengajuan: req.body.kantorPengajuan,
            jenisPemberitahuan: req.body.jenisPemberitahuan,
            jenisKeluar: req.body.jenisKeluar,
            userId: req.body.userId,
            typeReport: req.body.typeReport,
            BCDocumentType: req.body.BCDocumentType,
        };

        const result = await createReport(dataObj, null);
        const dataReturn = {
            reportId: result.id,
            userId: result.userId
        };

        return successResponse(res, Http.created, "Success Adding A Report", dataReturn)
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Failed To Add A Report", error);
    }
}

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
        const perkiraanTanggalResult = await createPerkiraanTanggalPengeluaran(perkiraanTanggalPengeluaran, transaction) 

        const dataToReturn = {
            dataPengajuanId: dataPengajuan.id,
            reportId: dataPengajuan.reportId,
            identitasPenerimaId: identitasPenerimaResult.id,
            identitasPengirimId: identitasPengirimResult.id,
            transaksiPerdaganganId: transaksiPerdaganganResult.id
        };

        await transaction.commit()

        return successResponse(res, Http.created, "Success Adding Data Header", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        // console.error(error);
        return errorResponse(res, Http.internalServerError, "Failed To Add Data", error)
    }
}

const addDataLanjutan = async (req, res) => {
    let transaction

    try {
        transaction = await sequelize.transaction();

        const { DataToInput: {listDokumen, petiKemas}} = req;
        
        const listDokumenResult = await createListDokumen(listDokumen, transaction);
        const petiKemasResult = await createDataPetiKemas(petiKemas, transaction)

        const dataToReturn = {
            listDokument: listDokumenResult.id,
            reportId: listDokumenResult.reportId,
            petiKemas: petiKemas.id,
        };

        await transaction.commit()

        return successResponse(res, Http.created, "Success Adding Data Lanjutan", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        // console.error(error);
        return errorResponse(res, Http.internalServerError, "Failed To Add Data", error)
    }
}

const addDataBarang = async (req, res) => {
    let transaction

    try {
        const { DataToInput: {listBarang}} = req;
        
        const promises = []
        listBarang.forEach(element => {
            promises.push(createListBarang(listBarang))
        });
        const result = await Promise.all(promises)

        const dataToReturn = {
            listBarang: result.map(ele => ele.id),
            reportId: listBarang[0].reportId,
        };

        await transaction.commit()

        return successResponse(res, Http.created, "Success Adding List Barang", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        // console.error(error);
        return errorResponse(res, Http.internalServerError, "Failed To Add Data", error)
    }
}

module.exports = (routes) => {
    routes.post('/', // --> url
        validationReport,
        validationResponse,
        addReport
    );
    routes.post('/data-header',
        validationDataPengajuan,
        validationIdentitasPengirim,
        validationIdentitasPenerima,
        validationTransaksiPerdagangan,
        validationResponse, // --> Middleware
        dataPengajuan,
        identitasPengirim,
        identitasPenerima,
        transaksiPerdagangan,
        addDataHeader
    );
    routes.post('/data-lanjutan', addDataLanjutan);
    routes.post('/data-barang', addDataBarang)
    /**
     * Testign purpose
     */

}