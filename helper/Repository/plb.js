const BeratDanVolume = require("../../database/models/berat_dan_volume");
const DataBarang = require("../../database/models/data_barang");
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

const listPLB = async(limit, offset, query = {}) => {
    limit = limit || 10;
    offset = offset || 0;
    try {
        const query = {
            where: {
                isDelete: false,
                ...query
            },
            attributes: {
                exclude: ['updatedAt', 'isDelete']
            },
            include: [
                {
                    model: PengusahaPLB,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: DataKapal,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                }
            ],
            limit: limit,
            offset: offset
        }
        const data = await Report.findAndCountAll(query);
        // if (!data) throw new NotFoundException("Data Tidak Ditemukan");
        return data;
    } catch (error) {
        if (error.name == "ReferenceError") {
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        } else {
            throw error
        }
        
    }
}

const getPLB = async(id) => {
    try {
        const query = {
            where: {
                id: id,
                isDelete: false
            },
            attributes: {
                exclude: ['updatedAt', 'isDelete']
            },
            include: [
                {
                    model: DokumenPemasukan,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: DokumenPengeluaran,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: DataKapal,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: IdentitasBarang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: PenjualBarang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: PengusahaPLB,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: PPJK,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: MataUang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: BeratDanVolume,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: TempatPenimbunan,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false
                },
                {
                    model: DataBarang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    required: false,
                    separate: true
                }
            ]
        }
        const data = await Report.findOne(query);
        // if (!data) throw new NotFoundException("Data Tidak Ditemukan");
        return data;
    } catch (error) {
        if (error.name == "ReferenceError") {
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        } else {
            throw error
        }
        
    }
}

module.exports = {
    listPLB,
    getPLB
}