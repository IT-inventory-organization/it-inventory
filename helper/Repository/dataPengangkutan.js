const DataPengangkutan = require("../../database/models/data_pengangkutan");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

const saveDataPengangkutan = async(data, transaction) => {
    try {
        const result = await DataPengangkutan.create(data, {
            transaction,
            returning: true
        });

        return result;
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

module.exports = {
    saveDataPengangkutan
}