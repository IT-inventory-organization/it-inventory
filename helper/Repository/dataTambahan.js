const DokumenTambahan = require("../../database/models/dokumen_tambahan")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");
const { convertStrignToDateUTC } = require("../convert")

const convert = (data) => {
    data.tanggalBC10 = convertStrignToDateUTC(data.tanggalBC10);
    data.tanggalBC11 = convertStrignToDateUTC(data.tanggalBC11);
    data.tanggalBL = convertStrignToDateUTC(data.tanggalBL);
}

/**
 * Save Data Tambahan
 * @param {number} reportId Report Id Pada Data 
 * @returns 
 */
const getDataTambahan = async (reportId) => {
    return DokumenTambahan.findOne({ where: { reportId: reportId } });
}

const saveDataTambahan = async(data, transaction) => {
    try {
        convert(data);

        return await DokumenTambahan.create(data, {
            transaction,
            returning: true
        })
    } catch (error) {

        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error);
        }
    }
}

const updateDataTambahan = async(data, reportId, transaction) => {
    try {
        convert(data);
        
        const query = {
            where: {
                id: data.id,
                reportId
            }
        };
        
        await isExist(DokumenTambahan, query);

        const result = await DokumenTambahan.update(data, {
            ...query,
            transaction,
            returning: true,
            plain:true,
        });

        return result[1].toJSON();
    } catch (error) {

        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else if(error.name == "ServerFault" || error.name == 'NotFoundException', error){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data", error);
        }
    }
}

module.exports = {
    getDataTambahan,
    saveDataTambahan,
    updateDataTambahan
}