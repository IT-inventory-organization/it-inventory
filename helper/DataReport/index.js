const { Op } = require('sequelize');
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
const authorization = require("../authorization");
const reportDataLartas = require('../../database/models/datalartas');
const Barang = require('../../database/models/barang');

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

const updateReport = async(id, data, req) => {
    let transaction;
    try {
        /**
         * 1. Find One Existing Data
         * 2. Compare Existing Data Dengan Update
         * 3. Jika Tidak Sama 
         */
        transaction = await sequelize.transaction();
        const found = await Report.findOne({where: {id: id}, transaction});
        if(!found){
            throw new Error('Data Not Found');
        }
        const resultToCheck = [];
        if(found.toJSON().jenisPemberitahuan !== data.jenisPemberitahuan){
            const listBarangOfExistingData = await reportListBarang.findAll({where:{reportId: id}}, transaction);
            console.log(listBarangOfExistingData);
            // return;
            if(data.jenisPemberitahuan === 'Export'){
                for (let i = 0; i < listBarangOfExistingData.length; i++) {
                    const Decrement = await Barang.decrement('stock', {
                        by: listBarangOfExistingData[i].toJSON().quantity,
                        where: {
                            id: listBarangOfExistingData[i].toJSON().idBarang,
                            userId: req.currentUser
                        },
                        transaction
                    });
                }
            }else if(data.jenisPemberitahuan === 'Import'){
                for(let i = 0; i < listBarangOfExistingData.length; i++){
                    const Increment = await Barang.increment('stock', {
                        by: listBarangOfExistingData[i].toJSON().quantity,
                        where: {
                            id: listBarangOfExistingData[i].toJSON().idBarang,
                            userId: req.currentUser
                        },
                        transaction
                    })
                }
            }
        }
        // return;
        const result = await Report.update(data, { 
            where: { id: id },
        });
        if(result[0] == 0){
            throw new Error(`Data Didn't Exists`);
        }
        return result
    } catch (error) {
        throw error;
    }
}

const checkAuthorization = async(req, idReport, transaction) => {
    if(! await authorization(Report, idReport, req)){
        throw new Error(`User is Not Authorized To Change The Data`);
    }
    return;
}

const countAllReport = async(req) => {
    try {
        let searchBasedUserId = '';
        if(req.currentRole !== 'Admin' && req.currentRole !== 'Owner') {
            searchBasedUserId=`AND "userId" = ${req.currentUser}`;
        }
        const res = sequelize.query(`SELECT "count"("jenisPemberitahuan"),"jenisPemberitahuan" FROM "Reports" WHERE "isDelete" = false ${searchBasedUserId} GROUP BY "jenisPemberitahuan"`);
        return res;
    } catch (error) {
        throw error;
    }
}

const countReportByType = async (type, req) => {
    try {
        let searchBasedUserId = '';
        if(req.currentRole !== 'Admin' && req.currentRole !== 'Owner') {
            searchBasedUserId=`AND "userId" = ${req.currentUser}`;
        }

        const res = sequelize.query(`SELECT "count"("jenisPemberitahuan"),"jenisPemberitahuan" FROM "Reports" WHERE status = '${type}' AND "isDelete" = false ${searchBasedUserId} GROUP BY "jenisPemberitahuan"`);
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

const deleteReport = async(idType, req) => {
    try {
        if(!await authorization(Report, idType, req)){
            throw new Error('User Is Not Authorized To Delete This Data');
        }

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
 * 
 * @param {Request} req 
 * @param {number} pageSize 
 * @param {number} pageNo 
 * @param {number} sortBy 
 * @param {string} searchQuery
 * @param {string} type 
 * @returns 
 */

const getAllReport = async (req, pageSize, pageNo, sortBy, searchQuery = null, type = null, status = null) => {
    try {
        let searchUser = 'AND';
        let qtSearch = '';
        let orderQuery = '';
        let typeQuery = '';
        let statusQuery = '';
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
            qtSearch+=`("RP"."typeReport"||' '||"RP"."BCDocumentType" ILIKE '%${searchQuery}%' OR "RP"."id"::text ILIKE '%${searchQuery}%' OR TO_CHAR("RP"."createdAt", 'dd-mm-yyyy') ILIKE '%${searchQuery}%' OR "US"."id"::text ILIKE '%${searchQuery}%' OR TO_CHAR("US"."createdAt", 'dd-mm-yyyy') ILIKE '%${searchQuery}%' OR "IPG"."namaPengirim" ILIKE '%${searchQuery}%' OR "IPN"."namaPenerima" ILIKE '%${searchQuery}%' OR "RP".status::text ILIKE '%${searchQuery}%')`
        }

        if(type != null){
            if((req.currentRole !== 'Admin' && req.currentRole !== 'Owner') || searchQuery != null){
                typeQuery+=`AND `
            }
            typeQuery+=`"RP"."typeReport" = '${type}'`;
        }
        if(status != null){
            if((req.currentRole !== 'Admin' && req.currentRole !== 'Owner') || searchQuery != null || type != null){
                statusQuery+=`AND `
            }
            if(status == 'All'){
                statusQuery += `"RP".status IS NOT NULL`;  
            }else if(status == 'Approval'){
                statusQuery += `"RP".status IS NULL`;
            }else{
                statusQuery += `"RP".status = '${status}'`;
            }
        }

        if(req.currentRole === "Admin" || req.currentRole === "Owner"){
            if(searchQuery == null){
                if(type == null){
                    if(status == null){
                        searchUser=' '; // Membuang AND
                    }
                }
            }
        }
        
        const res = await sequelize.query(`SELECT "RP"."typeReport"||' '||"RP"."BCDocumentType" as "jenisInventory","RP"."id" as "nomorAjuan", TO_CHAR("RP"."createdAt", 'dd-mm-yyyy') as "tanggalAjuan", "IPG"."namaPengirim" as pengirim, "IPN"."namaPenerima" as penerima, "RP".status as jalur, "RP"."isEditable" as edit FROM "Reports" as "RP" LEFT OUTER JOIN "Users" as "US" ON ("RP"."userId" = "US"."id") LEFT OUTER JOIN "IdentitasPengirim" as "IPG" ON ("RP"."id" = "IPG"."reportId") LEFT OUTER JOIN "IdentitasPenerima" as "IPN" ON ("RP"."id" = "IPN"."reportId") WHERE "RP"."isDelete" = false ${searchUser} ${statusQuery} ${qtSearch} ${typeQuery} ${orderQuery} LIMIT ${limit} OFFSET ${offset}`);

        const data = {
            data: res[0],
            data_size: res[0].length,
            page_size: +pageSize,
            page: +pageNo || 1
        }
        return data;
    } catch (error) {
        throw error
    }
}

const getAllReportByType = async (req, pageSize, pageNo, type = null) => {
    try {
        let searchUser = '';
        let typeQuery = '';
        const limit = pageSize ? +pageSize : 10
        const offset = pageNo ? (+pageNo - 1) * pageSize : 0;

        if(req.currentRole !== "Admin" && req.currentRole !== "Owner") { // Jika User
            searchUser+=`AND "RP"."userId" = ${req.currentUser}`;
        }

        if(type != null){
            // if(req.currentRole !== "Admin" && req.currentRole !== "Owner") { 
                typeQuery+=`AND `;
            // }
            switch (type) {
                case 'Import':
                case 'import':
                    typeQuery += `"RP"."jenisPemberitahuan" = 'Import'`;
                    break;
                case 'Export':
                case 'export':
                    typeQuery += `"RP"."jenisPemberitahuan" = 'Export'`;
                    break;
                default:
                    typeQuery = ``;
                    break;
            }
        }
        
        const sql = `SELECT "RP"."typeReport"||' '||"RP"."BCDocumentType" as "jenisInventory", TO_CHAR("RP"."createdAt", 'dd-mm-yyyy') as "tanggalAjuan", "IPG"."namaPengirim" as pengirim, "IPN"."namaPenerima" as penerima, "RP".status as jalur FROM "Reports" as "RP" INNER JOIN "Users" as "US" ON ("RP"."userId" = "US"."id") INNER JOIN "IdentitasPengirim" as "IPG" ON ("RP"."id" = "IPG"."reportId") INNER JOIN "IdentitasPenerima" as "IPN" ON ("RP"."id" = "IPN"."reportId") WHERE "RP".status = 'merah' AND "RP"."isDelete" = false ${searchUser} ${typeQuery} LIMIT ${limit} OFFSET ${offset}`;

        const result = await sequelize.query(sql);
        return result;
    } catch (error) {
        return error;
    }
}

const getOneReport = async(req, id, statusCheck = false) => {
    try {
        const query = {}
        query.where = {id}
        query.include = [
            {
                model: reportListBarang,
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                    include: ['quantity', 'id']
                },
                include: [
                    {
                        model: Barang,
                        attributes: {
                            exclude: ['isDelete', 'createdAt', 'updatedAt', 'userId']
                        },
                        where: {
                            isDelete: false
                        }
                    }
                ]
            },
            {
                model: reportDataPerkiraanTanggalPengeluaran,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }, 
            {
                model: reportIdentitasPenerima,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: reportIdentitasPengirim,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: reportListDokumen,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'isDelete']
                },
                where: {
                    isDelete: false
                }
            },
            {
                model: reportDataBeratDanVolume,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: reportDataPelabuhanMuatBongkar,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: reportDataPengajuan,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: reportDataPengangkutan,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: reportDataPetiKemas,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: reportDataPetiKemasDanPengemas,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: reportDataTempatPenimbunan,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: reportTransaksiPerdagangan,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            {
                model: User,
                attributes: ['name', 'email', 'npwp', 'address', 'mobile_phone', 'username']
            },
            {
                model: reportDataLartas,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ]
        if (req.currentRole !== "Admin" && req.currentRole !== "Owner") {
            query.where = {
                [Op.and]: [
                    {id},
                    {userId: req.currentUser}
                ],
            }
        }
        if(statusCheck){
            query.where = {
                ...query.where,
                status: {[Op.not]: null}
            }
        }
        query.attributes = {
            exclude: ['createdAt', 'updatedAt', 'isDelete']
        }
        query.where = {
            ...query.where,
            isDelete: false
        }
        const result = await Report.findOne(query);

        return result
    } catch (error) {

        throw new Error("Fail fetch data, please try again later, or refresh your browser")
    }
}

const updateStatus = async(id, status) => {
    try {
        const result = await Report.update({
            status: status,
            isEditable: false
        }, {
            where: { 
                id: id
            }
        })
        return result;
    } catch (error) {
        throw error.message;
    }
}

const getPerTable = async (model, idReport, type, transaction = null) => {
    try {
        const result = await model.findOne({
            include: [
                {
                    model: Report,
                    where: {
                        [Op.and]: [
                            {typeReport: type},
                            {isDelete: false}
                        ]
                    }
                }
            ],
            include: [],
            where: {
                reportId: idReport
            },
            transaction: transaction
        });

        return result;
    } catch (error) {
        throw error;
    }
}

const getPerTableBarangDokumen = async (model, idReport, type, transaction = null) => {
    try {
        const result = await model.findAll({
            include: [
                {
                    model: Report,
                    where: {
                        [Op.and]: [
                            {typeReport: type},
                            {isDelete: false}
                        ]
                    }
                }
            ],
            include: [],
            where: {
                [Op.and]: [
                    {reportId: idReport},
                    {isDelete: false}
                ]
            },
            transaction: transaction
        });
        return result
    } catch (error) {
        throw error;
    }
}

const getOneSpecificReport = async (req, id) => {
    try {
        if(! await authorization(Report, id, req, false)){
            throw new Error(`Users Is Not Authorized`);
        }
        const result = await Report.findOne({
            where: {
                id:id,
                isDelete: false,
                userId: req.currentUser
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createReport,
    countReportByType,
    deleteReport,
    getAllReport,
    getOneReport,
    countAllReport,
    getAllReportByType,
    updateReport,
    updateStatus,
    checkAuthorization,
    getPerTable,
    getPerTableBarangDokumen,
    getOneSpecificReport
}
