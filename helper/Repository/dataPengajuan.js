const { Transaction } = require("sequelize");
const DokumenPemasukan = require("../../database/models/dokumen_pemasukan");
const DokumenPengeluaran = require("../../database/models/dokumen_pengeluaran");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const getDataPengajuan = async (reportId) => {
    return DokumenPemasukan.findOne({ where: { reportId: reportId } });
}

const getDataPengajuanPengeluaran = async (reportId) => {
    return DokumenPengeluaran.findOne({
        where: { reportId: reportId },
        include: [DokumenPemasukan]
    });
}
/**
 * @async 
 * @method
 * @param {Object} data DataPemasukan
 * @param {Transaction} transaction Transaction From Sequelize
 * @returns {DokumenPemasukan} DokumenPemasukan Model 
 * @throws {ForeignKeyViolation} Error For This Specific Function
 * @throws {ConflictCreateData}
 */
const saveDataPengajuan = async (data, transaction) => {
    try {
        
        return DokumenPemasukan.create(data, {
            transaction,
            returning: true 
        });
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error);
        }
    }
}
/**
 * Save Dokumen Pengeluaran
 * @param {Object} data 
 * @param {Transaction} transaction 
 * @returns {DataPengajuanPengeluaran} DokumenPengeluaran Model
 * @throws {ForeignKeyViolation} Error Ketika Input Data
 */
const saveDataPengajuanPengeluaran = async (data, transaction) => {
    try {
        
        return DokumenPengeluaran.create(data, {
            transaction,
            returning: true 
        });
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error);
        }
    }
}

/**
 * Update Data Pengajuan
 * @async
 * @method
 * @param {Object} data DataPengajuan Model
 * @param {Number} reportId Number Report Id 
 * @param {Transaction} transaction Tranasction Dari Sequelize
 * @returns {DataPengajuan} Model Data Pengajuan
 * @throws {ForeignKeyViolation} Error Pada Update
 */
const updateDataPengajuan = async(data, reportId, transaction) => {
    try {
        const query = {
            where:{
                id: data.id,
                reportId
            }
        }

        await isExist(DokumenPemasukan, query);
        
        const result = await DokumenPemasukan.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        });

        return result[1].toJSON();
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error)
        }else if(error.name == 'ServerFault' || error.name == 'NotFoundException'){
            throw error
        }else{
            throw new ConflictCreateData('Gagal Menyimpan Data', error)
        }
    }
}
/**
 * Update Data Pengajuan
 * @async
 * @method
 * @param {Object} data DataPengajuan Model
 * @param {Number} reportId Number Report Id 
 * @param {Transaction} transaction Tranasction Dari Sequelize
 * @returns {DataPengajuan} Model Data Pengajuan
 * @throws {ForeignKeyViolation} Error Pada Update
 */
const updateDataPengajuanPengeluaran = async(data, reportId, transaction) => {
    try {
        const query = {
            where:{
                id: data.id,
                reportId
            }
        }

        await isExist(DokumenPengeluaran, query);
        
        const result = await DokumenPengeluaran.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        });

        return result[1].toJSON();
    } catch (error) {
        console.log(error)
        if (error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error)
        } else if (error.name == 'ServerFault' || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData('Gagal Menyimpan Data', error)
        }
    }
}

module.exports = {
    saveDataPengajuan,
    saveDataPengajuanPengeluaran,
    updateDataPengajuan,
    updateDataPengajuanPengeluaran,
    getDataPengajuan,
    getDataPengajuanPengeluaran
}