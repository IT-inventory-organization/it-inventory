const beratDanVolume = require("../../database/models/berat_dan_volume");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require('../checkExistingDataFromTable');

const getBeratDanVolume = async (reportId) => {
    return beratDanVolume.findOne({ where: { reportId: reportId } });
}

const saveBeratDanVolume = async(data, transaction) => {
    try {
        return beratDanVolume.create(data, {
            transaction,
            returning: true
        });
    } catch (error) {

        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server', error);
        }else{
            throw new ConflictCreateData('Gagal Menyimpan Data', error);
        }
    }
}

const updateBeratDanVolumeRepo = async(data, reportId, transaction) => {
    try {

        const query = {
            where: {
                id: data.id,
                reportId
            }
        }
        
        await isExist(beratDanVolume, query);

        const result = await beratDanVolume.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        })

        return result[1].toJSON();
    } catch (error) {

        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else if(error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data", error);
        }
    }
}

module.exports = {
    saveBeratDanVolume,
    updateBeratDanVolumeRepo,
    getBeratDanVolume
}