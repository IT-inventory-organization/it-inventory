const barangPO = require('../../database/models/barang_po');
const { ForeignKeyViolation, ConflictCreateData, NotFoundException, ServerFault, returnError } = require('../../middlewares/errHandler');
const saveDataBarangPO = async(data, transaction) => {
    try {
        return barangPO.create(data, {
            transaction,
            returning: true
        });
    } catch (error) {

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