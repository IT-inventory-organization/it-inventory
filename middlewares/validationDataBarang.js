const { body } = require('express-validator');

const validationListBarang = [
    body('posTarif').trim().notEmpty().withMessage(`"Pos Tarif" is required`),
    body('uraian').trim().notEmpty().withMessage(`"Uraian" is required`),
    body('nettoBrutoVolume').trim().notEmpty().withMessage(`"Netto, Bruto, Volume" is required`),
    body('satuanKemasan').trim().notEmpty().withMessage(`"Satuan Kemasan" Is Required`),
    body('nilaiPabeanHargaPenyerahan').trim().notEmpty().withMessage(`"Nilai Harga Pabean Penyerahan" Is Required`)
];

module.exports = {
    validationListBarang
}