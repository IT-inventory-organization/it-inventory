const IdentitasBarang = require("../../database/models/identitas_barang")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const getIdentitasBarang = async (reportId) => {
    return IdentitasBarang.findOne({ where: { reportId: reportId } });
}

const saveIdentitasBarang = async(data, transaction) => {
    try {
        return IdentitasBarang.create(data, {
            transaction,
            returning: true
        });
    } catch (error) {
        
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error);
        }
    }
}

const updateIdentitasBarangRepo = async(data, reportId, transaction) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId
            }
        }

        await isExist(IdentitasBarang, query);

        const result = await IdentitasBarang.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        });

        return result[1].toJSON();
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else if(error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data", error);
        }
    }
}

module.exports = {
    saveIdentitasBarang,
    updateIdentitasBarangRepo,
    getIdentitasBarang
}