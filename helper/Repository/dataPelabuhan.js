const DataPelabuhan = require("../../database/models/data_pelabuhan")
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const saveDataPelabuhan = async(data, transaction) => {
    try {
        const result = await DataPelabuhan.create(data, {
            transaction,
            returning: true
        });
        return result;
    } catch (error) {
        if(error.name === 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server")
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data")
        }

    }
}

module.exports = {
    saveDataPelabuhan
}