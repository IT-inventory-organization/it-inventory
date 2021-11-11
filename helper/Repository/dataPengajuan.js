const DokumenPemasukan = require("../../database/models/dokumen_pemasukan");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");

const saveDataPengajuan = async (data, transaction) => {
    try {
        const result = await DokumenPemasukan.create(data, {
            transaction,
            returning: true 
        });
        return result;
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

module.exports = {
    saveDataPengajuan
}