const { body } = require('express-validator');
const validationReport = [
    body('DataToInput.pengajuanSebagai').trim().notEmpty().withMessage(`"Pengajuan Sebagai" Is Required`),
    body('DataToInput.kantorPengajuan').trim().notEmpty().withMessage(`"Kantor Pengajuan" Is Required`),
    body('DataToInput.jenisPemberitahuan').trim().notEmpty().withMessage(`"Jenis Pemberitahuan" Is Required`),
    body('DataToInput.jenisMasuk').trim().notEmpty().withMessage(`"Jenis Masuk" Is Required`),
    body('DataToInput.BCDocumentType').trim().notEmpty().withMessage(`"Jenis Dokumen BC" Is Required`)
];

module.exports = validationReport;