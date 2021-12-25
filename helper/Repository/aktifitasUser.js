const UserAvtivity = require("../../database/models/aktifitasuser");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")

const saveAktifitasUser = async(data, transaction = null, req = null) => {
    try {
        return UserAvtivity.create(data, {
            transaction: transaction,
        });
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error, req);
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error, req);
        }
    }
}

module.exports = {
    saveAktifitasUser
}