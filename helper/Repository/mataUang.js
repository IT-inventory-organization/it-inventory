const MataUang = require("../../database/models/mata_uang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

const saveMataUang = async(data, transaction) => {
    try {
        const result = await MataUang.create(data, {
            transaction,
            returning: true
        })

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
    saveMataUang
}