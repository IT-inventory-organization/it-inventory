const { body } = require('express-validator');
const {checkFormat} = require('../helper/checkDateFormat');

const validationDokumen = [
    body('kodeDokumen').trim().notEmpty().withMessage(`"Kode Dokumen" Is Required`),
    body('nomorDokumen').trim().notEmpty().withMessage(`"Nomor Dokumen" Is Required`),
    body('tanggalDokumen').trim().notEmpty().withMessage(`"Tanggal Dokumen" Is Required`).custom(checkFormat),
    body('hsCode').trim().notEmpty().withMessage(`HS Code Is Required`)
];

const validationPetiKemas = [
    body('dataKontainer').trim().notEmpty().withMessage(`"Data Kontainer" Is Required`),
    body('volumeKontainer').trim().notEmpty().withMessage(`"Volume Kontainer" Is Required`)
];

module.exports = {
    validationDokumen,
    validationPetiKemas
}