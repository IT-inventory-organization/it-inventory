const IdentitasBarang = require("../../database/models/identitas_barang")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

const saveIdentitasBarang = async(data, transaction) => {
    try {
        const result = await IdentitasBarang.create(data, {
            transaction,
            returning: true
        });

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
    saveIdentitasBarang
}