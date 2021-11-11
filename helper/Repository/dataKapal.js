const DataKapal = require("../../database/models/data_kapal");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

const saveDataKapal = async (data, transaction) => {
    try {
        const result = await DataKapal.create(data, {
            transaction,
            returning: true
        });

        return result;
    } catch (error) {
        // console.log(error)
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation('TErjadi Kesalahan Pada Server');
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
} 

module.exports = {
    saveDataKapal
}