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
    IdentitasPenerima,
    IdentitasPengirim,
    TransaksiPerdagangan
} = require('../../helper/bundleDataReportHeader');

const sequelize = require('../../configs/database')
const {
    validationDataPengajuan, 
    validationIdentitasPengirim, 
    validationIdentitasPenerima,
    validationTransaksiPerdagangan
} = require('../../middlewares/validationReportInput');

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

        const { DataToInput: {Pengajuan, IdentitasPenerima, IdentitasPengirim, TransaksiPerdagangan}} = req;
        
        const dataPengajuan = await createDataPengajuan(Pengajuan, transaction); // Simpan Ke Table Data Pengajuan
        const identitasPenerimaResult = await createReportIdentitasPenerima(IdentitasPenerima, transaction); // Simpan Ke Table Identitas Penerima
        const identitasPengirimResult = await createReportIdentitasPengirim(IdentitasPengirim, transaction); // Simpan Ke Table Identitas Pengirim
        const TransaksiPerdaganganResult = await createReportTransaksiPerdagangan(TransaksiPerdagangan, transaction); // Simpan Ke Table Transaksi Perdagangan

        const dataToReturn = {
            dataPengajuanId: dataPengajuan.id,
            reportId: dataPengajuan.reportId,
            identitasPenerimaId: identitasPenerimaResult.id,
            identitasPengirimId: identitasPengirimResult.id,
            TransaksiPerdaganganId: TransaksiPerdaganganResult.id
        };

        await transaction.commit()

        return successResponse(res, Http.created, "Success Adding A Data From Data Header", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        // console.error(error);
        return errorResponse(res, Http.internalServerError, "Failed To Add Data", error)
    }
}

module.exports = (routes) => {
    routes.post(
        '/', // --> url
        validationReport,
        validationResponse,
        addReport
    );
    routes.post(
        '/DataHeader',
        validationDataPengajuan,
        validationIdentitasPengirim,
        validationIdentitasPenerima,
        validationTransaksiPerdagangan,
        validationResponse, // --> Middleware
        dataPengajuan,
        IdentitasPengirim,
        IdentitasPenerima,
        TransaksiPerdagangan,
        addDataHeader
    );
    /**
     * Testign purpose
     */

}