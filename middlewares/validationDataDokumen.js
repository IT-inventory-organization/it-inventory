const { body, check } = require('express-validator');
const { checkFormat } = require('../helper/checkDateFormat');

const vDataPengajuan = [
    body('ref.dataPengajuan.nomorDokumenPemasukan').trim().isString().notEmpty().withMessage("Nomor Dokumen Pemasukan Harus Diisi"),
    body('ref.dataPengajuan.tanggalDokumenPemasukan').trim().custom(checkFormat)
];

module.exports = {
  vDataPengajuan  
}