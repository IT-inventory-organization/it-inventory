const { body } = require('express-validator');
const { checkFormat } = require('../helper/checkDateFormat');
const validationReport = [
    body('pengajuanSebagai').trim().notEmpty().withMessage(`"Pengajuan Sebagai" Is Required`),
    body('kantorPengajuan').trim().notEmpty().withMessage(`"Kantor Pengajuan" Is Required`),
    body('jenisPemberitahuan').trim().notEmpty().withMessage(`"Jenis Pemberitahuan" Is Required`),
    body('jenisKeluar').trim().notEmpty().withMessage(`"Jenis Keluar" Is Required`),
    body('typeReport').trim().notEmpty().withMessage(`"Tipe Report" is Required`),
    body('BCDocumentType').trim().notEmpty().withMessage(`"Jenis Dokumen BC" Is Required`)
];

const validationDataPengajuan = [
    body('kantorPabeanAsal').trim().notEmpty().withMessage(`"Kantor Pabean Asal" Is Required`),
    body('kategoryPemberitahuan').trim().notEmpty().withMessage(`"Kategori Pemberitahuan" Is Required`),
    body('kategoryPengeluaran').trim().notEmpty().withMessage(`"Kategori Pengeluaran" Is Required`),
    body('tujuanPengeluaran').trim().notEmpty().withMessage(`"Tujuan Pengeluaran" Is Required`),
    body('asalBarang').trim().notEmpty().withMessage(`"Asal Barang" Is Required`),
    body('caraPembayaran').trim().notEmpty().withMessage(`"Cara Pembayaran" Is Required`),
    // body('reportId').trim().notEmpty().withMessage(`"Report Id" Is Required`),
]

const validationIdentitasPengirim = [
    body('jenisIdentitasPengirim').trim().notEmpty().withMessage(`"Jenis Identitas Pengirim" Is Required`),
    body('nomorIdentitasPengirim').trim().notEmpty().withMessage(`"Nomor identitas Pengirim" Is Required`),
    body('namaPengirim').trim().notEmpty().withMessage(`"Nama Pengirim" Is Required`),
    body('alamatPengirim').trim().notEmpty().withMessage(`"Alamat Pengirim" Is Required`),
    body('nomorIjinBpkPengirim').trim().notEmpty().withMessage(`"Nomor Ijin Bpk Pengirim" Is Required`),
    body('tanggalIjinBpkPengirim').trim().notEmpty().withMessage(`"Tanggal Ijin Bpk Pengirim" Is Required`).custom(checkFormat),
]

const validationIdentitasPenerima = [
    body('jenisIdentitasPenerima').trim().notEmpty().withMessage(`"Jenis Identitas Penerima" Is Required`),
    body('nomorIdentitasPenerima').trim().notEmpty().withMessage(`"Nomor identitas Penerima" Is Required`),
    body('namaPenerima').trim().notEmpty().withMessage(`"Nama Penerima" Is Required`),
    body('alamatPenerima').trim().notEmpty().withMessage(`"Alamat Penerima" Is Required`)
];

const validationTransaksiPerdagangan = [
    body('transaksi').trim().notEmpty().withMessage(`"Transaksi" Is Required`),
    body('transaksiLainnya').trim().notEmpty().withMessage(`"Transaksi Lainnya" Is Required`),
    body('valuta').trim().notEmpty().withMessage(`"Valuta" Is Required`),
    body('kursNDPBM').trim().notEmpty().withMessage(`"Kurs NDPBM" Is Required`),
    body('cif').trim().notEmpty().withMessage(`"CIF" Is Required`),
    body('voluntaryDeclaration').trim().notEmpty().withMessage(`"Voluntary Declaration" Is Required`),
    body('freight').trim().notEmpty().withMessage(`"Freight" Is Required`),
];

const validationDataPengangkutan = [
    body('caraAngkut').trim().notEmpty().withMessage(`"Cara Angkut" Is Required`),
    body('namaPengangkut').trim().notEmpty().withMessage(`"Nama Pengangkut" Is Required`),
    body('bendera').trim().notEmpty().withMessage(`"Bendara" Is Required`),
    body('nomorVoyFlightPol').trim().notEmpty().withMessage(`"Nomor Voy Flight Pol" Is Required`)
];

const validationDataPelabuhanMuatBongkar = [
    body('pelabuhanMuat').trim().notEmpty().withMessage(`"Pelabuhan Muat" Is Required`),
    body('pelabuhanTujuan').trim().notEmpty().withMessage(`"Pelabuhan Tujuan" Is Required`),
    body('pelabuhanTransit').trim().notEmpty().withMessage(`"Pelabuhan Transit" Is Required`)
];

const validationBeratDanVolume = [
    body('beratBersih').trim().notEmpty().withMessage(`"Berat Bersih" Is Required`),
    body('beratKotor').trim().notEmpty().withMessage(`"Berat Kotor" Is Required`),
    body('volume').trim().notEmpty().withMessage(`"Volume" Is Required`)
];

const validationDataPetiKemasDanPengemas = [
    body('jumlahJenisKemasan').trim().notEmpty().withMessage(`"Jumlah Jenis Kemasan" Is Required`),
    body('jumlahPetiKemas').trim().notEmpty().withMessage(`"Jumlah Peti Kemas" Is Required`),
    body(`jumlahJenisBarang`).trim().notEmpty().withMessage(`"Jumlah Jenis Barang" Is Required`)
];

const validationDataPerkiraanTanggalPengeluaran = [
    body('perkiraanTanggalPengeluaran').trim().notEmpty().withMessage(`"Perkiraan Tanggal Pengeluaran" Is Required`).custom(checkFormat)
];

const validationDataTempatPenimbunan = [
    body('tempatPenimbunan').trim().notEmpty().withMessage(`"Tempat Penimbunan" Is Required`)
]

module.exports = {
    validationReport,
    validationDataPengajuan,
    validationIdentitasPengirim,
    validationIdentitasPenerima,
    validationTransaksiPerdagangan,
    validationDataPengangkutan,
    validationDataPelabuhanMuatBongkar,
    validationBeratDanVolume,
    validationDataPetiKemasDanPengemas,
    validationDataPerkiraanTanggalPengeluaran,
    validationDataTempatPenimbunan
}