const barangPO = require('../../database/models/barang_po');
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const saveDataBarangPO = async(data, transaction) => {
    try {
        const res = await barangPO.create(data, {
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
    saveDataBarangPO
}