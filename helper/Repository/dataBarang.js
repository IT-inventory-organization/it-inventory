const data_barang = require('../../database/models/data_barang');
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const saveDataBarang = async(data, transaction) => {
    try {
        const res = await data_barang.create(data, {
            transaction 
        })
        return res;
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server')
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data")
        }
    }
}
module.exports = {
    saveDataBarang
}