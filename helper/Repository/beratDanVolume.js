const beratDanVolume = require("../../database/models/berat_dan_volume");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

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

module.exports = {
    saveBeratDanVolume
}