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
            throw ForeignKeyViolation('Terjadi Kesalahan Pada Server')
        }
    }
}
module.exports = {
    saveDataBarang
}