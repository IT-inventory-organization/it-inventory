const { Op } = require("sequelize");
const beratDanVolume = require("../../database/models/berat_dan_volume");
const dataBarang = require("../../database/models/data_barang");
const DataKapal = require("../../database/models/data_kapal");
const DataPelabuhan = require("../../database/models/data_pelabuhan");
const DataPengangkutan = require("../../database/models/data_pengangkutan");
const DokumenPemasukan = require("../../database/models/dokumen_pemasukan");
const DokumenPengeluaran = require("../../database/models/dokumen_pengeluaran");
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
                    attributes: ['id','voyageKapal', 'namaKapal', ['benderaKapal', 'bendera']],
                    required: true,
                },
                {
                    model: dataBarang,
                    attributes: ['id','kodeBarang', 'namaBarang', ['uraian', 'itemDeskripsi'], 'satuanKemasan', ['stock', 'quantity']],
                    required: true
                },
                {
                    model: TempatPenimbunan,
                    attributes: ['isTempatPenimbunan'],
                    where: {
                        isTempatPenimbunan: true
                    }
                },
                {
                    model: DokumenPemasukan,
                    include:[
                        {
                            model: DokumenPengeluaran
                        }
                    ]
                }
            ],
            where: {
                userId: idUser
            },
            attributes: [['jenisPemberitahuan', 'jenisDokumen'],['id','reportId']],
            plain: false,
            // logging: console.log
        }
        
        return await Report.findAll(query);
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getAllInventory
}