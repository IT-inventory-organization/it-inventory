const PengusahaPLB = require("../../database/models/pengusaha_plb");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");

const savePengusahaPLB = async(data, transaction) => {
    try {
        const result = await PengusahaPLB.create(data, {
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
    savePengusahaPLB,
}