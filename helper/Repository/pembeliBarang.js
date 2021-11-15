const PembeliBarang = require("../../database/models/pembeli_barang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

const savePembeliBarang = async(data, transaction) => {
    try {
        const result = await PembeliBarang.create(data,{
            transaction,
            returning: true
        })

        return result
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server")
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

module.exports = {
    savePembeliBarang
}