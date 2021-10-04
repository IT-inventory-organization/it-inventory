const { Op, Sequelize } = require('sequelize');
const sequelize = require('../../configs/database');
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

const createReport = async (data, transaction) => {
    try {
        const result = await Report.create(data);
        // DONT USE TRANSACTION
        // DO NOTHING ON ERROR
        // NESTED TRYCATCH MUST USE FINALLY ON THE INNER BLOCK
        // try {
        //     const resultActivity = await UserActivity.create(data.userId, result.id, "Create report")
        // } catch (error) {
            
        // } finally {

        // }
        return result;
    } catch (error) {
        throw Error(error.message);
    }
}

const countReportByType = async (type, req) => {
    try {
        const res = sequelize.query(`SELECT "count"("jenisPemberitahuan"),"jenisPemberitahuan" FROM "Reports" WHERE status = '${type}' AND "userId" = ${req.currentUser} GROUP BY "jenisPemberitahuan"`);
        // const result = await Report.count({
        //     where: {
        //         [Op.and]: [
        //             {'status': type},
        //             {'isDelete': false}
        //         ],
        //         userId: req.currentUser
        //     },
        //     group: [
        //         []
        //     ]
        // });
        return res;
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

/**
 * searchQuery == null && Role === Admin --> 
 * 
 * @param {Request} req 
 * @param {*} pageSize 
 * @param {*} pageNo 
 * @param {*} sortBy 
 * @param {*} searchQuery 
 * @returns 
 */

const getAllReport = async (req, pageSize, pageNo, sortBy, searchQuery = null) => {
    try {
        let searchUser = 'WHERE ';
        let qtSearch = '';
        let orderQuery = '';
        const limit = pageSize ? +pageSize : 10
        const offset = pageNo ? (+pageNo - 1) * pageSize : 0

        switch (sortBy) {
            case "oldest":
                orderQuery+=`ORDER BY "RP"."createdAt" ASC`;
                break;
            default: 
                orderQuery+=`ORDER BY "RP"."createdAt" DESC`;
                break;
        }
 
        if(req.currentRole !== "Admin" && req.currentRole !== "Owner") { // Jika User
            searchUser+=`"RP"."userId" = ${req.currentUser}`;
        }

        if(searchQuery != null){
            if(req.currentRole !== "Admin" && req.currentRole !== "Owner"){
                qtSearch+=`AND `;
            }
            qtSearch+=`"RP"."typeReport"||' '||"RP"."BCDocumentType" ILIKE '%${searchQuery}%' OR "RP"."id"::text ILIKE '%${searchQuery}%' OR TO_CHAR("RP"."createdAt", 'dd-mm-yyyy') ILIKE '%${searchQuery}%' OR "US"."id"::text ILIKE '%${searchQuery}%' OR TO_CHAR("US"."createdAt", 'dd-mm-yyyy') ILIKE '%${searchQuery}%' OR "IPG"."namaPengirim" ILIKE '%${searchQuery}%' OR "IPN"."namaPenerima" ILIKE '%${searchQuery}%' OR "RP".status::text ILIKE '%${searchQuery}%'`
        }

        if(req.currentRole === "Admin" || req.currentRole === "Owner"){
            if(searchQuery == null){
                searchUser=' '
            }
        }
        // const result = await Report.findAndCountAll(query);
        const res = await sequelize.query(`SELECT "RP"."typeReport"||' '||"RP"."BCDocumentType" as "jenisInvetory","RP"."id" as "nomorAjuan", TO_CHAR("RP"."createdAt", 'dd-mm-yyyy') as "tanggalAjuan", "US"."id" as "nomorDaftar", TO_CHAR("US"."createdAt", 'dd-mm-yyyy') as "tanggalDaftar", "IPG"."namaPengirim" as pengirim, "IPN"."namaPenerima" as penerima, "RP".status as jalur FROM "Reports" as "RP" INNER JOIN "Users" as "US" ON ("RP"."userId" = "US"."id") INNER JOIN "IdentitasPengirim" as "IPG" ON ("RP"."id" = "IPG"."reportId") INNER JOIN "IdentitasPenerima" as "IPN" ON ("RP"."id" = "IPN"."reportId") ${searchUser} ${qtSearch} ${orderQuery} LIMIT ${limit} OFFSET ${offset}`);

        // const result = await Report.findAndCountAll(query);
        const data = {
            data: res[0],
            data_size: res[0].length,
            page_size: pageSize,
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
