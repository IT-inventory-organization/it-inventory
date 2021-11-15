const { body, check } = require('express-validator');
const { checkFormat } = require('../../helper/checkDateFormat');

// Dokumen Pemasukan
const vDataPengajuan = [
    body('ref.dataPemasukan.nomorDokumenPemasukan').trim().isString().notEmpty().withMessage("Nomor Dokumen Pemasukan Harus Diisi"),
    body('ref.dataPemasukan.tanggalDokumenPemasukan').trim().custom(checkFormat)
];

const vDataTambahan = [
  body('ref.dataTambahan.nomorBC10').trim().isString().notEmpty(),
  body('ref.dataTambahan.nomorBC11').trim().isString().notEmpty(),
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
  body('ref.dataKapal.tanggalKedatangan').trim().custom(checkFormat),
  body('ref.dataKapal.tanggalKeberangkatan').trim().custom(checkFormat)
];

const vIdentitasBarang = [
  body('ref.identitasBarang.negaraAsal').notEmpty().trim().withMessage("Kolom Negara Asal Terjadi Kesalahan"),
  body('ref.identitasBarang.jenisBarang').notEmpty().trim().withMessage("Kolom Jenis Barang Terjadi Kesalahan"),
  body('ref.identitasBarang.nilaiBarang').notEmpty().trim().withMessage("Kolom Nilai Barang Terjadi Kesalahan"),
  body('ref.identitasBarang.caraPembayaran').notEmpty().trim().withMessage("Kolom Cara Pembayaran Terjadi Kesalahan"),
  body('ref.identitasBarang.asalBarang').notEmpty().trim().withMessage("Kolom Asal Barang Terjadi Kesalahan"),
  body('ref.identitasBarang.jumlahBarang').notEmpty().trim().withMessage("Kolom Jumlah Barang Terjadi Kesalahan"),
  body('ref.identitasBarang.jumlahKemasan').notEmpty().trim().withMessage("Kolom Jumlah Kemasan Terjadi Kesalahan")
];

const vPenjualBarang = [
  body('ref.penjualBarang.jenisIdentitasPenjual').trim().isString().withMessage("Kolom Jenis Identitas Penjual Terjadi Kesalahan"),
  body('ref.penjualBarang.namaPenjual').trim().isString().withMessage("Kolom Nama Penjual Terjadi Kesalahan"),
  body('ref.penjualBarang.alamatPenjual').trim().isString().withMessage("Kolom Alamat Penjual Terjadi Kesalahan"),
];

const vPengirimBarang = [
  body('ref.pengirimBarang.jenisIdentitasPengirim').trim().notEmpty().isString().withMessage("Kolom Jenis Identitas Pengirim Terjadi Kesalahan"),
  body('ref.pengirimBarang.namaPengirim').trim().notEmpty().withMessage("Kolom Nama Pengirim Terjadi Kesalahan"),
  body('ref.pengirimBarang.nomorIdentitasPengirim').trim().notEmpty().isString().withMessage("Kolom Nomor Identitas Pengirim Terjadi Kesalahan"),
  body('ref.pengirimBarang.alamatPengirim').trim().notEmpty().withMessage("Kolom Alamat Pengirim Terjadi Kesalahan"),
]

const vPengusahaPLB = [
  body('ref.pengusahaPLB.jenisIdentitasPengusahaPLB').trim().notEmpty().isString().withMessage("Kolom Jenis Identitas Pengusaha PLB Terjadi Kesalahan"),
  body('ref.pengusahaPLB.namaPengusahaPLB').trim().notEmpty().withMessage("Kolom Nama Pengusaha PLB Terjadi Kesalahan"),
  body('ref.pengusahaPLB.nomorIdentitasPengusahaPLB').trim().notEmpty().isString().withMessage("Kolom Nomor Identitas Pengusaha PLB Terjadi Kesalahan"),
  body('ref.pengusahaPLB.alamatPengusahaPLB').trim().notEmpty().withMessage("Kolom Alamat Pengusaha PLB Terjadi Kesalahan"),
]

const vPpjk = [
  body('ref.ppjk.jenisIdentitasPpjk').trim().isString().withMessage("Kolom Jenis Identitas PPJK Terjadi Kesalahan"),
  body('ref.ppjk.namaPpjk').trim().isString().withMessage("Kolom Nama PPJK Terjadi Kesalahan"),
  body('ref.ppjk.nomorIdentitasPpjk').trim().isString().withMessage("Kolom Nomor Identitas PPJK Terjadi Kesalahan"),
  body('ref.ppjk.alamatPpjk').trim().isString().withMessage("Kolom Alamat PPJK Terjadi Kesalahan"),
]

const vMataUang = [
  body("ref.mataUang.valuta").trim().notEmpty().isString().withMessage("Kolom Valuta Terjadi Kesalahan"),
  body("ref.mataUang.freight").trim().notEmpty().isString().withMessage("Kolom Freight Terjadi Kesalahan"),
  body("ref.mataUang.ndbpmKurs").trim().notEmpty().isString().withMessage("Kolom NDBPM Kurs Terjadi Kesalahan"),
  body("ref.mataUang.cif").trim().notEmpty().isString().withMessage("Kolom CIF Terjadi Kesalahan"),
  body("ref.mataUang.transaksiLainnya").trim().notEmpty().isString().withMessage("Kolom Transaksi Lainnya Terjadi Kesalahan"),
  body("ref.mataUang.hargaPenyerahan").trim().notEmpty().isString().withMessage("Kolom Harga Penyerahan Terjadi Kesalahan"),
]

const vDataPengangkutan = [
  body("ref.dataPengangkutan.caraAngkut").trim().notEmpty().isString().withMessage("Kolom Cara Angkut Terjadi Kesalahan"),
  body("ref.dataPengangkutan.bendera").trim().notEmpty().isString().withMessage("Kolom Bendera Terjadi Kesalahan"),
  body("ref.dataPengangkutan.namaPengangkut").trim().notEmpty().isString().withMessage("Kolom Nama PEngangkut Terjadi Kesalahan"),
  body("ref.dataPengangkutan.nomorVoyFlightPol").trim().notEmpty().isString().withMessage("Kolom Nomor Voy Flight Pol Terjadi Kesalahan"),
]

const vBeratDanVolume = [
  body("ref.beratDanVolume.beratMuatan").trim().notEmpty().withMessage("Kolom Berta Muatan Terjadi Kesalahan"),
  body("ref.beratDanVolume.volume").trim().notEmpty().withMessage("Kolom Volume Terjadi Kesalahan"),
  body("ref.beratDanVolume.beratKapalDenganMuatan").trim().notEmpty().withMessage("Kolom Berat Kapal + Muatan Terjadi Kesalahan")
]

const vTempatPenimbunan = [
  body('ref.tempatPenimbunan.tempatPenimbunan').trim().isString().withMessage("Kolom Tempat Penimbunan Terjadi Kesalahan"),
  body('ref.tempatPenimbunan.perkiraanTanggalPengeluaran').trim().custom(checkFormat),
  body('ref.tempatPenimbunan.isTempatPenimbunan').trim().notEmpty()
]

module.exports = {
  vDataPengajuan,
  vDataTambahan,
  vDataPelabuhan,
  vDataKapal,
  vIdentitasBarang,
  vPenjualBarang,
  vPengirimBarang,
  vPengusahaPLB,
  vPpjk,
  vMataUang,
  vDataPengangkutan,
  vBeratDanVolume,
  vTempatPenimbunan
}