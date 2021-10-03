const { body, check } = require('express-validator');

const validationListBarang = [
    body('posTarif').trim().notEmpty().withMessage(`"Pos Tarif" is required`),
    body('uraian').trim().notEmpty().withMessage(`"Uraian" is required`),
    body('nettoBrutoVolume').trim().notEmpty().withMessage(`"Netto, Bruto, Volume" is required`),
    body('satuanKemasan').trim().notEmpty().withMessage(`"Satuan Kemasan" Is Required`),
    body('nilaiPabeanHargaPenyerahan').trim().notEmpty().withMessage(`"Nilai Harga Pabean Penyerahan" Is Required`)
];

const validationArrListBarang = [
    body('*.posTarif').notEmpty().trim().withMessage(`"Pos Tarif" Is Required`),
    body('*.uraian').notEmpty().trim().withMessage(`"Uraian" Is Required`),
    body('*.nettoBrutoVolume').notEmpty().trim().withMessage(`"Netto, Bruto, Volume" Is Required`),
    body('*.satuanKemasan').notEmpty().trim().withMessage(`"Satuan Kemasan"`),
    body('*.nilaiPabeanHargaPenyerahan').notEmpty().trim().withMessage(`"Nilai Pabean Harga Penyerahan" Is Required`),
    body('*.reportId').notEmpty().trim()
]

module.exports = {
    validationListBarang,
    validationArrListBarang
}