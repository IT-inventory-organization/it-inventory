const beratDanVolume = require("../../database/models/berat_dan_volume");
const dataBarang = require("../../database/models/data_barang");
const DataKapal = require("../../database/models/data_kapal");
const DataPelabuhan = require("../../database/models/data_pelabuhan");
const DataPengangkutan = require("../../database/models/data_pengangkutan");
const DokumenPemasukan = require("../../database/models/dokumen_pemasukan");
const DokumenTambahan = require("../../database/models/dokumen_tambahan");
const IdentitasBarang = require("../../database/models/identitas_barang");
const MataUang = require("../../database/models/mata_uang");
const PembeliBarang = require("../../database/models/pembeli_barang");
const PengirimBarang = require("../../database/models/pengirim_barang");
const PengusahaPLB = require("../../database/models/pengusaha_plb");
const PenjualBarang = require("../../database/models/penjual_barang");
const PPJK = require("../../database/models/ppjk");
const Report = require("../../database/models/report");
const TempatPenimbunan = require("../../database/models/tempat_penimbunan");
const { ServerFault, NotFoundException } = require("../../middlewares/errHandler");

const getAllInventory = async (req, idUser) => {
    try {
        const query = {
            include: [
                {
                    model: DataKapal,
                    attributes: ['voyageKapal', 'namaKapal', ['benderaKapal', 'bendera']],
                    required: true,
                },
                {
                    model: dataBarang,
                    attributes: ['kodeBarang', 'namaBarang', ['uraian', 'itemDeskripsi'], 'satuanKemasan', ['stock', 'quantity']],
                    required: true
                }
            ],
            where: {
                userId: idUser
            },
            attributes: [['jenisPemberitahuan', 'jenisDokumen']],
            plain: false,
            // logging: console.log
        }

        const result = await Report.findAll(query);

        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllInventory
}