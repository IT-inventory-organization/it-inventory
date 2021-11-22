const dataPO = require('../../database/models/po');
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const saveDataPO = async(data, transaction) => {
    try {
        const res = await dataPO.create(data, {
            transaction,
            returning: true
        })
        return res;
    } catch (error) {
        console.log(error)
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server')
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data")
        }
    }
}
module.exports = {
    saveDataPO
}