const PenjualBarang = require("../../database/models/penjual_barang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");

const savePenjualBarang = async(data, transaction) => {
    try {
        const result = await PenjualBarang.create(data, {
            transaction, 
            returning: true
        });
        return result;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

module.exports = {
    savePenjualBarang
}