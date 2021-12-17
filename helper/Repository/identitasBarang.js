const IdentitasBarang = require("../../database/models/identitas_barang")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const getIdentitasBarang = async (reportId) => {
    const data = await IdentitasBarang.findOne({ where: { reportId: reportId } });
    return data;
}

const saveIdentitasBarang = async(data, transaction) => {
    try {
        const result = await IdentitasBarang.create(data, {
            transaction,
            returning: true
        });

        return result
    } catch (error) {

        
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
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
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else if(error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data");
        }
    }
}

module.exports = {
    saveIdentitasBarang,
    updateIdentitasBarangRepo,
    getIdentitasBarang
}