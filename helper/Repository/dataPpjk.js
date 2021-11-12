const PPJK = require("../../database/models/ppjk")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

const saveDataPpjk = async(data, transaction) => {
    try {
        const result = await PPJK.create(data, {
            transaction,
            returning: true
        })

        return result;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server")
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data")
        }
    }
}

module.exports = {
    saveDataPpjk
}