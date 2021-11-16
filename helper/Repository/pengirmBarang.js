const PengirimBarang = require("../../database/models/pengirim_barang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const savePengirimBarang = async(data, transaction) => {
    try {
        const result = await PengirimBarang.create(data, {
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

const updatePengirimBarangRepo = async(data, reportId, transaction) => {
    try {
        const query = {
            where: {
                id:data.id,
                reportId
            }
        }

        await isExist(PengirimBarang, query);

        const result = await PengirimBarang.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        })

        return result[1].toJSON();
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else if(error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data");
        }
    }
}

module.exports = {
    savePengirimBarang,
    updatePengirimBarangRepo
}