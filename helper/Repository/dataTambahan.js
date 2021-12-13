const DokumenTambahan = require("../../database/models/dokumen_tambahan")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");
const { convertStrignToDateUTC } = require("../convert")

const convert = (data) => {
    data.tanggalBC10 = convertStrignToDateUTC(data.tanggalBC10);
    data.tanggalBC11 = convertStrignToDateUTC(data.tanggalBC11);
    data.tanggalBL = convertStrignToDateUTC(data.tanggalBL);
}

const getDataTambahan = async (reportId) => {
    const data = await DokumenTambahan.findOne({ where: { reportId: reportId } });
    return data;
}

const saveDataTambahan = async(data, transaction) => {
    try {
        convert(data);

        const result = await DokumenTambahan.create(data, {
            transaction,
            returning: true
        })
        return result
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
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
        console.log(error)
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else if(error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data");
        }
    }
}

module.exports = {
    getDataTambahan,
    saveDataTambahan,
    updateDataTambahan
}