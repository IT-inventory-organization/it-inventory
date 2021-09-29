const { body } = require('express-validator');

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
    body('kategoryPemberitahuan').trim().notEmpty().withMessage(`"Kantor Pengajuan" Is Required`),
    body('kategoryPengeluaran').trim().notEmpty().withMessage(`"Jenis Pemberitahuan" Is Required`),
    body('tujuanPengeluaran').trim().notEmpty().withMessage(`"Jenis Keluar" Is Required`),
    body('asalBarang').trim().notEmpty().withMessage(`"Asal Barang" Is Required`),
    body('caraPembayaran').trim().notEmpty().withMessage(`"Cara Pembayaran" Is Required`),
    body('reportId').trim().notEmpty().withMessage(`"Report Id" Is Required`),
]

const validationIdentitasPengirim = [
    body('jenisIdentitasPengirim').trim().notEmpty().withMessage(`"Jenis Identitas Pengirim" Is Required`),
    body('nomorIdentitasPengirim').trim().notEmpty().withMessage(`"Nomor identitas Pengirim" Is Required`),
    body('namaPengirim').trim().notEmpty().withMessage(`"Nama Pengirim" Is Required`),
    body('alamatPengirim').trim().notEmpty().withMessage(`"Alamat Pengirim" Is Required`),
    body('nomorIjinBpkPengirim').trim().notEmpty().withMessage(`"Nomor Ijin Bpk Pengirim" Is Required`),
    body('tanggalIjinBpkPengirim').trim().notEmpty().withMessage(`"Tanggal Ijin Bpk Pengirim" Is Required`).custom(value => {
        const regex = new RegExp(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)
        
        if(!regex.test(value)){
            throw Error('Date Format is Incorrect, Format example: dd-mm-yyyy');
        }

        return true;

    }),
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
]

module.exports = {
    validationReport,
    validationDataPengajuan,
    validationIdentitasPengirim,
    validationIdentitasPenerima,
    validationTransaksiPerdagangan
}