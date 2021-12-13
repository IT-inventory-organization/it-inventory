const invoicePO = require('../../database/models/invoice_po');
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const saveDataInvoicePO = async(data, transaction) => {
    try {
        const res = await invoicePO.create(data, {
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
    saveDataInvoicePO
}