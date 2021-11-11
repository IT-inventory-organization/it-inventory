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
  body('ref.dataPelabuhan.pelabuhan').notEmpty().trim().isString().withMessage("Kolom Pelabuhan Terjadi Kesalahan"),
  body('ref.dataPelabuhan.status').notEmpty().trim().withMessage("Status Pelabuhan Tidak Ada")
];

const vDataKapal = [
  body('ref.dataKapal.voyageKapal').trim().notEmpty().isString().withMessage("Kolom Voyage Kapal Terjadi Kesalahan"),
  body('ref.dataKapal.benderaKapal').trim().notEmpty().withMessage("Kolom Bendera Kapal Terjadi Kesalahan"),
  body('ref.dataKapal.namaKapal').trim().notEmpty().isString().withMessage("Kolom Nama Kanpal Terjadi Kesalahan"),
  body('ref.dataKapal.tanggaLKedatangan').trim().custom(checkFormat),
  body('ref.dataKapal.tanggalKeberangkatan').trim().custom(checkFormat)
];


module.exports = {
  vDataPengajuan,
  vDataTambahan,
  vDataPelabuhan,
  vDataKapal
}