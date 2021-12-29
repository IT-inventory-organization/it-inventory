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
const { isExist } = require("../checkExistingDataFromTable");

const saveReport = async (data) => {
    try {
        return Report.create(data,{
            logging:true,
            returning: true
        });
    } catch (error) {

        return false
    }
}

const getReportPerId = async(id, type = 'pemasukan', req = null) => {
    try {
        let include = null;
        if(type == 'pemasukan'){
            include = [
                {
                    model: DokumenPemasukan,
                    // required: true,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                },
                {
                    model: TempatPenimbunan,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    },
                    include: [
                        {
                            model: DataKapal,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            }
                        }
                    ]
                },
            ]
        }else if(type == 'pengeluaran'){
            include = [
                {
                    model: DokumenPengeluaran,
                    // required: true,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                }
            ]
        }
        const query = {
            where: {
                id: id,
                isDelete: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDelete']
            },
            include: [
                ...include,
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
                    model: dataBarang,
                    attributes: {
                        exclude: ['updatedAt', 'createdAt']
                    }
                }
            ]
        }
        const resultReportPerId = await Report.findOne(query);
        if(!resultReportPerId){
            throw new NotFoundException("Data Tidak Ditemukan", '', req);
        }
        return resultReportPerId.toJSON();
    } catch (error) {

        if(error.name == "ReferenceError"){
            throw new ServerFault("Terjadi Kesalahan Pada Server", error, req)
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
            attributes: ['jenisDokumenBC', 'jenisPemberitahuan', 'updatedAt', 'id'],
            include: [
                {
                    model: DataKapal,
                    attributes:  ['voyageKapal', 'namaKapal', 'benderaKapal']
                }
            ]
        }
        const resultDashboard = await Report.findAll(query);
        if(!resultDashboard){
            throw new NotFoundException("Data Tidak Ditemukan", '', req);
        }
        return resultDashboard;
    } catch (error){

        if(error.name == "ReferenceError"){
            throw new ServerFault("Terjadi Kesalahan Pada Server", error, req)
        }else{
            throw error
        }
    }
}

const getKapalPenjual = async(req, idUser) => {
    try {
        const query = {
            include: [
                {
                    model: TempatPenimbunan,
                    required: true,
                    where: {
                        isTempatPenimbunan: true,
                        reportId: {
                            [Op.ne] : null
                        }
                    },
                    attributes: ['isTempatPenimbunan']
                },
                {
                    model: DataKapal,
                    required: true,
                    attributes: [
                        'voyageKapal',
                        'namaKapal', 
                        'id'
                    ],
                    where: {
                        reportId: {
                            [Op.ne] : null
                        }
                    }
                }
            ],
            where: {
                userId: {
                    [Op.ne]: idUser
                },
            },
            raw: true,
            attributes: ['id']
        }

        const result = await Report.findAll(query);
        if(!result){
            throw new NotFoundException('Data Tidak Ditemukan')
        }
        
        const fetchFilter = [];
        for (const value of result) {
            let obj = {};
            for (const val in value) {
                __regexKapalPenjual(val, obj, value);

            }
            fetchFilter.push(obj);
        }
        return fetchFilter;

    } catch (error) {
        console.log(error)
        if(error.name == "ReferenceError"){
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        }else{
            throw error;
        }
    }
}

/**
 * To Reduce Cognitive Complexity For getKapalPenjual Function
 * @param {Object} val 
 * @param {Object} obj 
 */
const __regexKapalPenjual = (val, obj, value) => {
    const regex = /[\.]/i;        
    if(regex.test(val)){
        const split = val.split('.');
        if(split[1] == 'id' && split[0] == 'dataKapal'){
            obj['idKapal'] = value[val];    
        }else{
            obj[split[1]] = value[val];
        }
    }else{
        obj[val] = value[val];
    }
}

const deleteReport = async (req, idReport, idUser) => {
    try {
        const checkReport = await Report.findOne({
            where: {
                id: idReport,
                userId: idUser
            }
        });

        if(!checkReport){
            throw new NotFoundException("Data Tidak Ada");
        }

        return Report.update({
            isDelete: true
        }, {
            where: {
                id: idReport
            }
        })
    } catch (error) {
        throw new ServerFault('Terjaid Kesalaha Pada Server', error, req);
    }
}

const getReportForUpdate = async(req, idReport) => {
    try {
        return Report.findOne({
            where: {
                id: idReport,
                userId: req.currentUser
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDelete']
            }
        });
    } catch (error) {
        throw new ServerFault('Terjadi Kesalahan Pada Server', error, req);
    }
}

const updateReportPLB = async(req, idReport, data) => {
    try {
        await isExist(Report, {
            where: {
                id: idReport,
                userId: req.currentUser
            }
        })
        return Report.update(data, {
            where: {
                id: idReport,
                userId: req.currentUser
            }
        })
    } catch (error) {
        throw new ServerFault("Terjadi Kesalahan Padas Server", error, req)
    }
}
module.exports = {
    saveReport,
    getReportPerId,
    dashboard,
    getKapalPenjual,
    deleteReport,
    getReportForUpdate,
    updateReportPLB
}