const dataBarang = require('../../database/models/data_barang');
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');

const getDataBarang = async (reportId) => {
    const data = await dataBarang.findAll({ where: { reportId: reportId } });
    return data;
}

const saveDataBarang = async(data, transaction) => {
    try {
        const res = await dataBarang.create(data, {
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
    saveDataBarang,
    getDataBarang
}