const TempatPenimbunan = require("../../database/models/tempat_penimbunan");
const { ConflictCreateData, ForeignKeyViolation } = require("../../middlewares/errHandler")

const saveTempatPenimbunan = async(data, transaction) => {
    try {
        const result = await TempatPenimbunan.create(data, {
            transaction,
            returning: true
        });
        return result;
    } catch (error) {
        console.log(error)
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

module.exports = {
    saveTempatPenimbunan
}