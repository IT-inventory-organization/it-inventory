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
const Sequelize = require('sequelize');

const Op = Sequelize.Op;
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
const getReportByUser= async(req) => {

    try {
        const query = {
            where: {
                userId: req.currentUser,
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
                    model: DataKapal,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    where:{
                        'namaKapal':{
                            [Op.ne]: null
                          }
                    }
                },
                {
                    model: DokumenPengeluaran,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt',]
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
        const resultReportPerId = await Report.findAll(query);
        if(!resultReportPerId){
            throw new NotFoundException("Data Tidak Ditemukan");
        }
        console.log(resultReportPerId)
        return resultReportPerId;
    } catch (error) {
        // console.log('Repository Trigger', error)
        if(error.name == "ReferenceError"){
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        }else{
            throw error
        }
        
    }
}
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

const dashboard = async(req) => {
    try {
        const query = {
            where: {
                userId: req.currentUser,
                isDelete: false
            },
            attributes: ['jenisDokumenBC'],
            include: [
                {
                    model: DataKapal,
                    attributes:  [
                            'voyageKapal', 'namaKapal', 'benderaKapal',
                            'updatedAt', 'createdAt'],
                    where:{
                        'namaKapal':{
                            [Op.ne]: null
                            }
                    }
                    
                }
            ]
        }
        const resultDashboard = await Report.findAll(query);
        if(!resultDashboard){
            throw new NotFoundException("Data Tidak Ditemukan");
        }
        return resultDashboard;
    } catch (error){
        console.log(error)
        if(error.name == "ReferenceError"){
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        }else{
            throw error
        }
    }
}

const getPO = async(req) => {
    try {
        const query = {
            where: {
                userId: req.currentUser,
                isDelete: false
            },
            attributes: ['jenisDokumenBC'],
            include: [
                {
                    model: DataKapal,
                    attributes:  [
                            'voyageKapal', 'namaKapal', 'benderaKapal',
                            'updatedAt', 'createdAt']
                    
                }
            ]
        }
        const resultDashboard = await Report.findAll(query);
        if(!resultDashboard){
            throw new NotFoundException("Data Tidak Ditemukan");
        }
        return resultDashboard;
    } catch (error){
        console.log(error)
        if(error.name == "ReferenceError"){
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        }else{
            throw error
        }
    }
}

/**
 * {
 *  include:[
 *     {
 *          model: dataKapal,
 *          attributes: ['voyageKapal', 'namaKapal'],
 *     },
 *     {
 *      }
 * 
 *  ]
 * }
 */
module.exports = {
    saveReport,
    getReportPerId,
    dashboard,
    getReportByUser
}