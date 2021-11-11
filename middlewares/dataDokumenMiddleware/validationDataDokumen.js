const { body, check } = require('express-validator');
const { checkFormat } = require('../../helper/checkDateFormat');

const vDataPengajuan = [
    body('ref.dataPemasukan.nomorDokumenPemasukan').trim().isString().notEmpty().withMessage("Nomor Dokumen Pemasukan Harus Diisi"),
    body('ref.dataPemasukan.tanggalDokumenPemasukan').trim().custom(checkFormat)
];

const vDataTambahan = [
  body('ref.dataTambahan.nomorBC10').trim().isString(),
  body('ref.dataTambahan.nomorBC11').trim().isString(),
  body('ref.dataTambahan.nomorBL').trim().isString(),
  body('ref.dataTambahan.tanggalBC10').trim().custom(checkFormat),
  body('ref.dataTambahan.tanggalBC11').trim().custom(checkFormat),
  body('ref.dataTambahan.tanggalBL').trim().custom(checkFormat),
];

const vDataPelabuhan = [
  body('ref.dataPelabuhan.pelabuhan').notEmpty().trim().isString().withMessage("Pelabuhan Kolom Kosong"),
  body('ref.dataPelabuhan.status').notEmpty().trim().withMessage("Status Pelabuhan Tidak Ada")
]

module.exports = {
  vDataPengajuan,
  vDataTambahan,
  vDataPelabuhan
}