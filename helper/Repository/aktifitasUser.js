const UserAvtivity = require("../../database/models/aktifitasuser");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

const saveAktifitasUser = async(data, transaction = null) => {
    try {
        await UserAvtivity.create(data, {
            transaction,
        });
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

module.exports = {
    saveAktifitasUser
}