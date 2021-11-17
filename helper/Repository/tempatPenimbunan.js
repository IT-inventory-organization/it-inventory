const TempatPenimbunan = require("../../database/models/tempat_penimbunan");
const { ConflictCreateData, ForeignKeyViolation } = require("../../middlewares/errHandler");
const { convertStrignToDateUTC } = require("../convert");
const { isExist } = require("../checkExistingDataFromTable");

const convert = (data) => {
    data.perkiraanTanggalPengeluaran = convertStrignToDateUTC(data.perkiraanTanggalPengeluaran)
}

const saveTempatPenimbunan = async(data, transaction) => {
    try {
        convert(data);
        const result = await TempatPenimbunan.create(data, {
            transaction,
            returning: true
        });
        return result;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

const updateTempatPenimbunanRepo = async(data, reportId, transaction) => {
    try {
        console.log(data);
        const query = {
            where: {
                id: data.id,
                reportId
            }
        }

        await isExist(TempatPenimbunan, query)

        const result = await TempatPenimbunan.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        })

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
    saveTempatPenimbunan,
    updateTempatPenimbunanRepo
}