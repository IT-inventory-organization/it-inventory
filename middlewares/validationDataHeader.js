const { body, check } = require('express-validator');
const { checkFormat } = require('../helper/checkDateFormat');
const validationReport = [
    body('pengajuanSebagai').trim().notEmpty().withMessage(`"Pengajuan Sebagai" Is Required`),
    body('kantorPengajuan').trim().notEmpty().withMessage(`"Kantor Pengajuan" Is Required`),
    body('jenisPemberitahuan').trim().notEmpty().withMessage(`"Jenis Pemberitahuan" Is Required`),
    body('jenisKeluar').trim().notEmpty().withMessage(`"Jenis Keluar" Is Required`),
    body('typeReport').trim().notEmpty().withMessage(`"Tipe Report" is Required`),
    body('BCDocumentType').trim().notEmpty().withMessage(`"Jenis Dokumen BC" Is Required`)
];
/**
 * TODO: Fix Header
 */
const validationDataPengajuan = [
    body('DataToInput.dataPengajuan.kantorPabeanAsal').trim().notEmpty().withMessage(`"Kantor Pabean Asal" Is Required`),
    body('DataToInput.dataPengajuan.kategoryPemberitahuan').trim().notEmpty().withMessage(`"Kategori Pemberitahuan" Is Required`),
    body('DataToInput.dataPengajuan.kategoryPengeluaran').trim().notEmpty().withMessage(`"Kategori Pengeluaran" Is Required`),
    body('DataToInput.dataPengajuan.tujuanPengeluaran').trim().notEmpty().withMessage(`"Tujuan Pengeluaran" Is Required`),
    body('DataToInput.dataPengajuan.asalBarang').trim().notEmpty().withMessage(`"Asal Barang" Is Required`),
    body('DataToInput.dataPengajuan.caraPembayaran').trim().notEmpty().withMessage(`"Cara Pembayaran" Is Required`),
    // body('reportId').trim().notEmpty().withMessage(`"Report Id" Is Required`),
]

const validationPPJK = [
    body('DataToInput.identitasPPJK.jenisIdentitasPPJK').trim().notEmpty().withMessage(`"Jenis Identitas PPJK" is Required`),
    body('DataToInput.identitasPPJK.nomorIdentitasPPJK').trim().notEmpty().withMessage(`"Nomor Identitas PPJK" Is Requried`),
    body('DataToInput.identitasPPJK.namaPPJK').trim().notEmpty().withMessage(`"Nama PPJK" Is Required`),
    body('DataToInput.identitasPPJK.alamatPPJK').trim().notEmpty().withMessage(`"Alamat PPJK" Is Required`)
]

const validationIdentitasPengirim = [
    body('DataToInput.identitasPengirim.jenisIdentitasPengirim').trim().notEmpty().withMessage(`"Jenis Identitas Pengirim" Is Required`),
    body('DataToInput.identitasPengirim.nomorIdentitasPengirim').trim().notEmpty().withMessage(`"Nomor identitas Pengirim" Is Required`),
    body('DataToInput.identitasPengirim.namaPengirim').trim().notEmpty().withMessage(`"Nama Pengirim" Is Required`),
    body('DataToInput.identitasPengirim.alamatPengirim').trim().notEmpty().withMessage(`"Alamat Pengirim" Is Required`),
    body('DataToInput.identitasPengirim.nomorIjinBpkPengirim').trim().notEmpty().withMessage(`"Nomor Ijin Bpk Pengirim" Is Required`),
    body('DataToInput.identitasPengirim.tanggalIjinBpkPengirim').trim().notEmpty().withMessage(`"Tanggal Ijin Bpk Pengirim" Is Required`),
]

const validationIdentitasPenerima = [
    body('DataToInput.identitasPenerima.caraAngkutPenerima').trim().notEmpty().withMessage(`"Cara Angkut Penerima" Is Required`),
    body('DataToInput.identitasPenerima.namaPengangkutPenerima').trim().notEmpty().withMessage(`"Nama Pengangkut Penerima" Is Required`),
    body('DataToInput.identitasPenerima.benderaPenerima').trim().notEmpty().withMessage(`"Bendera Penerima" Is Required`),
    body('DataToInput.identitasPenerima.nomorVoyFlightPolPenerima').trim().notEmpty().withMessage(`Nomor Voy Flight Pol Penerima" Is Required`)
];

const validationTransaksiPerdagangan = [
    body('DataToInput.transaksiPerdagangan.transaksi').trim().notEmpty().withMessage(`"Transaksi" Is Required`),
    body('DataToInput.transaksiPerdagangan.transaksiLainnya').trim().notEmpty().withMessage(`"Transaksi Lainnya" Is Required`),
    body('DataToInput.transaksiPerdagangan.valuta').trim().notEmpty().withMessage(`"Valuta" Is Required`),
    body('DataToInput.transaksiPerdagangan.kursNDPBM').trim().notEmpty().withMessage(`"Kurs NDPBM" Is Required`),
    body('DataToInput.transaksiPerdagangan.cif').trim().notEmpty().withMessage(`"CIF" Is Required`),
    body('DataToInput.transaksiPerdagangan.voluntaryDeclaration').trim().notEmpty().withMessage(`"Voluntary Declaration" Is Required`),
    body('DataToInput.transaksiPerdagangan.freight').trim().notEmpty().withMessage(`"Freight" Is Required`),
    body('DataToInput.transaksiPerdagangan.hargaPenyerahan').trim().notEmpty().withMessage(`"Harga Penyerahan" Is Required`)
];

const validationDataPengangkutan = [
    body('DataToInput.dataPengangkutan.caraAngkut').trim().notEmpty().withMessage(`"Cara Angkut" Is Required`),
    body('DataToInput.dataPengangkutan.namaPengangkut').trim().notEmpty().withMessage(`"Nama Pengangkut" Is Required`),
    body('DataToInput.dataPengangkutan.bendera').trim().notEmpty().withMessage(`"Bendara" Is Required`),
    body('DataToInput.dataPengangkutan.nomorVoyFlightPol').trim().notEmpty().withMessage(`"Nomor Voy Flight Pol" Is Required`)
];

const validationDataPelabuhanMuatBongkar = [
    body('DataToInput.dataPelabuhanMuatBongkar.pelabuhanMuat').trim().notEmpty().withMessage(`"Pelabuhan Muat" Is Required`),
    body('DataToInput.dataPelabuhanMuatBongkar.pelabuhanTujuan').trim().notEmpty().withMessage(`"Pelabuhan Tujuan" Is Required`),
    body('DataToInput.dataPelabuhanMuatBongkar.pelabuhanTransit').trim().notEmpty().withMessage(`"Pelabuhan Transit" Is Required`)
];

const validationBeratDanVolume = [
    body('DataToInput.dataBeratDanVolume.beratBersih').trim().notEmpty().withMessage(`"Berat Bersih" Is Required`),
    body('DataToInput.dataBeratDanVolume.beratKotor').trim().notEmpty().withMessage(`"Berat Kotor" Is Required`),
    body('DataToInput.dataBeratDanVolume.volume').trim().notEmpty().withMessage(`"Volume" Is Required`)
];

const validationDataPetiKemasDanPengemas = [
    body('DataToInput.dataPetiKemasDanPengemas.jumlahJenisKemasan').trim().notEmpty().withMessage(`"Jumlah Jenis Kemasan" Is Required`),
    body('DataToInput.dataPetiKemasDanPengemas.jumlahPetiKemas').trim().notEmpty().withMessage(`"Jumlah Peti Kemas" Is Required`),
    body(`DataToInput.dataPetiKemasDanPengemas.jumlahJenisBarang`).trim().notEmpty().withMessage(`"Jumlah Jenis Barang" Is Required`)
];

const validationDataPerkiraanTanggalPengeluaran = [
    body('DataToInput.dataPerkiraanTanggalPengeluaran.perkiraanTanggalPengeluaran').trim().notEmpty().withMessage(`"Perkiraan Tanggal Pengeluaran" Is Required`)
];

const validationDataTempatPenimbunan = [
    body('DataToInput.dataTempatPenimbunan.tempatPenimbunan').trim().notEmpty().withMessage(`"Tempat Penimbunan" Is Required`)
]
const validationDataLartas = [
    body('DataToInput.dataLartas.name').trim().notEmpty().withMessage(`"Data Lartas" Is Required`)
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
    validationDataTempatPenimbunan,
    validationDataLartas,
    validationPPJK
}