const beratDanVolume = require("../../database/models/berat_dan_volume");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require('../checkExistingDataFromTable');

const getBeratDanVolume = async (reportId) => {
    const data = await beratDanVolume.findOne({ where: { reportId: reportId } });
    return data;
}

const saveBeratDanVolume = async(data, transaction) => {
    try {
        console.log(data)
        const result = await beratDanVolume.create(data, {
            transaction,
            returning: true
        });
        return result;
    } catch (error) {
        console.log(error)
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server');
        }else{
            throw new ConflictCreateData('Gagal Menyimpan Data');
        }
    }
}

const updateBeratDanVolumeRepo = async(data, reportId, transaction) => {
    try {
        console.log(data);
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
    saveBeratDanVolume,
    updateBeratDanVolumeRepo,
    getBeratDanVolume
}