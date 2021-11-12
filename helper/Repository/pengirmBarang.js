const pengirim_barang = require("../../database/models/pengirim_barang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");

const savePengirimBarang = async(data, transaction) => {
    try {
        const result = await pengirim_barang.create(data, {
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
    savePengirimBarang
}