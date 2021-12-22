const PembeliBarang = require("../../database/models/pembeli_barang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const getPembeliBarang = async (reportId) => {
    return PembeliBarang.findOne({ where: { reportId: reportId } });
}

const savePembeliBarang = async(data, transaction) => {
    try {

        return PembeliBarang.create(data,{
            transaction,
            returning: true
        })
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error)
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error);
        }
    }
}

const updatePembeliBarangRepo = async(data, reportId, transaction) => {
    try {

        const query = {
            where: {
                id: data.id,
                reportId
            }
        }

        await isExist(PembeliBarang, query);

        const result = await PembeliBarang.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        })

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
    savePembeliBarang,
    updatePembeliBarangRepo,
    getPembeliBarang
}