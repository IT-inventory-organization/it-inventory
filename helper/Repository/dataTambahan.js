const DokumenTambahan = require("../../database/models/dokumen_tambahan")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")
const { convertStrignToDateUTC } = require("../convert")

const convert = (data) => {
    data.tanggalBC10 = convertStrignToDateUTC(data.tanggalBC10);
    data.tanggalBC11 = convertStrignToDateUTC(data.tanggalBC11);
    data.tanggalBL = convertStrignToDateUTC(data.tanggalBL);
}

const saveDataTambahan = async(data, transaction) => {
    try {
        convert(data);
        const result = await DokumenTambahan.create(data, {
            transaction,
            returning: true
        })
        return result
    } catch (error) {
        console.log(error)
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

module.exports = {
    saveDataTambahan
}