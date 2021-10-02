const { Op } = require('sequelize');
const Report = require('../../database/models/report');
const reportIdentitasPenerima = require('../../database/models/identitaspenerima');
const reportIdentitasPengirim = require('../../database/models/identitaspengirim');
const reportListBarang = require('../../database/models/listbarang');
const reportListDokumen = require('../../database/models/listdokumen');
const reportDataPerkiraanTanggalPengeluaran = require('../../database/models/dataperkiraantanggalpengeluaran');
const reportDataBeratDanVolume = require('../../database/models/databeratdanvolume');
const reportDataPelabuhanMuatBongkar = require('../../database/models/datapelabuhanmuatbongkar');
const reportDataPengajuan = require('../../database/models/datapengajuan');
const reportDataPengangkutan = require('../../database/models/datapengangkutan');
const reportDataPetiKemas = require('../../database/models/datapetikemas');
const reportDataPetiKemasDanPengemas = require('../../database/models/datapetikemasdanpengemas');
const reportDataTempatPenimbunan = require('../../database/models/datatempatpenimbunan');
const reportTransaksiPerdagangan = require('../../database/models/transaksiperdagangan');
const User = require('../../database/models/user');
const authorization = require('../authorization');


const createReport = async (data, transaction) => {
    try {
        const result = await Report.create(data);
        // DONT USE TRANSACTION
        // DO NOTHING ON ERROR
        // NESTED TRYCATCH MUST USE FINALLY ON THE INNER BLOCK
        try {
            const resultActivity = await UserActivity.create(data.userId, result.id, "Create report")
        } catch (error) {
            
        } finally {

        }
        return result;
    } catch (error) {
        throw Error(error.message);
    }
}

const countReportByType = async (type, req) => {
    try {
        const result = await Report.count({
            where: {
                [Op.and]: [
                    {'jenisPemberitahuan': type},
                    {'isDelete': false}
                ],
                userId: req.currentUser
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteReport = async(idType) => {
    try {
        const result = Report.update({
            isDelete: true,
        },{
            where: {
                id: idType
            }
        });

        return result;
    } catch (error) {
        throw error
    }
}

const getAllReport = async (req, pageSize, pageNo, sortBy) => {
    try {
        const limit = pageSize ? +pageSize : 10
        const offset = pageNo ? (+pageNo - 1) * pageSize : 0
        const query = {}
        query.include = [
            {
                model: User
            }
        ]
        switch (sortBy) {
            case "oldest":
                query.order = ["createdAt", "ASC"]
                break;
            default: 
                query.order = ["createdAt", "DESC"]
        }
        query.order = ["createdAt", "DESC"]
        query.limit = limit
        query.offset = offset
        if(req.currentRole !== "Admin" && req.currentUser !== "Owner") {
            query.where = {
                userId: req.currentUser
            }
        }
        const result = await Report.findAndCountAll(query)
        const data = {
            data: result.rows,
            data_size: result.count,
            page_size: limitValue,
            page: pageNo || 1
        }
        return data;
    } catch (error) {
        return {error}
    }
}

const getOneReport = async(req, id) => {
    try {
        const query = {}
        query.where = {id}
        query.include = [
            {
                model: reportListBarang
            }, 
            {
                model: reportDataPerkiraanTanggalPengeluaran
            }, 
            {
                model: reportIdentitasPenerima
            },
            {
                model: reportIdentitasPengirim
            },
            {
                model: reportListDokumen
            },
            {
                model: reportDataBeratDanVolume,
            },
            {
                model: reportDataPelabuhanMuatBongkar
            },
            {
                model: reportDataPengajuan
            },
            {
                model: reportDataPengangkutan
            },
            {
                model: reportDataPetiKemas
            },
            {
                model: reportDataPetiKemasDanPengemas
            },
            {
                model: reportDataTempatPenimbunan
            },
            {
                model: reportTransaksiPerdagangan
            },
            {
                model: User
            }
        ]
        if (req.currentRole !== "Admin" && req.currentRole !== "Owner") {
            query.where = {
                [Op.and]: [
                    {id},
                    {userId: req.currentUser}
                ]
            }
           
        }
        const result = await Report.findOne(query)
        return result
    } catch (error) {
        throw new Error("Fail fetch data, please try again later, or refresh your browser")
    }
}

module.exports = {
    createReport,
    countReportByType,
    deleteReport,
    getAllReport,
    getOneReport,
}

// const get = () => {
//     const resilt = await report.findAll({ 
//         attributes: {
//             'jenisInvetory'
//         },
//         includes: [
//             {
//                 model: reportIdentitasPenerima,
//                 attributes: {
//                     'jenisInvetory'
//                 }
//             },

//         ]
//     })
// }