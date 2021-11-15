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

const saveReport = async(data) => {
    try {
        const result = await Report.create(data,{
            logging:true,
            returning: true
        });
        
        return result;
    } catch (error) {
        console.log('Repository trigger',error)
        return false
    }
}

/**
 * * Data Barang Belum
 *  
 */
const getReportPerId = async(id) => {
    try {
        const query = {
            where: {
                id: id,
                isDelete: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDelete']
            },
            include: [
                {
                    model: DokumenPemasukan,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt',]
                    }
                },
                {
                    model: DokumenTambahan,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: DataPelabuhan,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: DataKapal,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: IdentitasBarang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: PenjualBarang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: PengirimBarang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: PengusahaPLB,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: PembeliBarang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: PPJK,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: MataUang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: DataPengangkutan,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: beratDanVolume,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: TempatPenimbunan,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: dataBarang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                }
            ]
        }
        const resultReportPerId = await Report.findOne(query);
        if(!resultReportPerId){
            throw new NotFoundException("Data Tidak Ditemukan");
        }
        return resultReportPerId.toJSON();
    } catch (error) {
        // console.log('Repository Trigger', error)
        if(error.name == "ReferenceError"){
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        }else{
            throw error
        }
        
    }
}

module.exports = {
    saveReport,
    getReportPerId
}