const DokumenTambahan = require("../../database/models/dokumen_tambahan")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

const saveDataTambahan = async(data, transaction) => {
    try {
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

module.exports = {
    saveDataTambahan
}