const beratDanVolume = require("../../database/models/berat_dan_volume")
const dataBarang = require("../../database/models/data_barang")
const DataKapal = require("../../database/models/data_kapal")
const DataPelabuhan = require("../../database/models/data_pelabuhan")
const DataPengangkutan = require("../../database/models/data_pengangkutan")
const DokumenPengeluaran = require("../../database/models/dokumen_pengeluaran")
const DokumenTambahan = require("../../database/models/dokumen_tambahan")
const IdentitasBarang = require("../../database/models/identitas_barang")
const MataUang = require("../../database/models/mata_uang")
const PembeliBarang = require("../../database/models/pembeli_barang")
const PengirimBarang = require("../../database/models/pengirim_barang")
const PengusahaPLB = require("../../database/models/pengusaha_plb")
const PenjualBarang = require("../../database/models/penjual_barang")
const PPJK = require("../../database/models/ppjk")
const Report = require("../../database/models/report")

const getOneDocumentPengeluaran = async(req, idReport) => {
    return DokumenPengeluaran.findOne({
        include: [
            {
                model: Report,
                attributes: ['jenisPemberitahuan', 'diAjukanDiKantor', 'jenisDokumenBC'],
                where: {
                    id: idReport
                },
                include: [
                    {
                        model: DokumenTambahan,
                        attributes: ['nomorBC10', 'tanggalBC10', 'nomorBC11', 'tanggalBC11', 'nomorBL', 'tanggalBL']
                    },
                    {
                        model: DataPelabuhan,
                        attributes: ['pelabuhan'],
                    },
                    {
                        model: DataKapal,
                        attributes: ['voyageKapal', 'benderaKapal', 'tanggalKedatangan', 'namaKapal', 'tanggalKeberangkatan'],
                    },
                    {
                        model: IdentitasBarang,
                        attributes: ['negaraAsal', 'asalBarang', 'jenisBarang', 'jumlahBarang','nilaiBarang', 'jumlahKemasan', 'caraPembayaran']
                    },
                    {
                        model: PenjualBarang,
                        attributes: ['nomorIdentitasPenjual', 'namaPenjual', 'alamatPenjual']
                    },
                    {
                        model: PengusahaPLB,
                        attributes: ['nomorIdentitasPengusahaPLB', 'namaPengusahaPLB', 'alamatPengusahaPLB']
                    },
                    {
                        model: PengirimBarang,
                        attributes: ['nomorIdentitasPengirim', 'namaPengirim', 'alamatPengirim'] 
                    },
                    {
                        model: PembeliBarang,
                        attributes: ['nomorIdentitasPembeli', 'namaPembeli', 'alamatPembeli']
                    },
                    {
                        model: PPJK,
                        attributes: ['nomorIdentitasPpjk', 'namaPpjk', 'alamatPpjk']
                    },
                    {
                        model: MataUang,
                        attributes: ['valuta', 'freight', 'ndbpmKurs', 'cif', 'transaksiLainnya', 'hargaPenyerahan']
                    },
                    {
                        model: DataPengangkutan,
                        attributes: ['caraAngkut', 'namaPengangkut', 'bendera', 'nomorVoyFlightPol']
                    },
                    {
                        model: beratDanVolume,
                        attributes: ['beratMuatan', 'beratKapalDenganMuatan', 'volume']
                    },
                    {
                        model: dataBarang,
                        attributes: {
                            exclude: ['id', 'createdAt', 'updatedAt', 'reportId']
                        }
                    }
                ]
            }
        ],
        attributes: ['nomorDokumen', 'tanggalDokumen']
    })
}

const getOneDocumentPengeluaranXML = async(req, idReport) => {
    return DokumenPengeluaran.findOne({
        include: [
            {
                model: Report,
                where: {
                    id: idReport
                },
                include: [
                    {
                        model: DokumenTambahan,
                    },
                    {
                        model: DataPelabuhan,
                    },
                    {
                        model: DataKapal,
                    },
                    {
                        model: IdentitasBarang,
                    },
                    {
                        model: PenjualBarang,
                    },
                    {
                        model: PengusahaPLB,
                    },
                    {
                        model: PengirimBarang,
                    },
                    {
                        model: PembeliBarang,
                    },
                    {
                        model: PPJK,
                    },
                    {
                        model: MataUang,
                    },
                    {
                        model: DataPengangkutan,
                    },
                    {
                        model: beratDanVolume,
                    },
                    {
                        model: dataBarang,
                    }
                ]
            }
        ],
    })
}

module.exports = {
    getOneDocumentPengeluaran,
    getOneDocumentPengeluaranXML
}