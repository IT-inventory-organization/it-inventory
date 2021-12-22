const PengirimBarang = require("../../database/models/pengirim_barang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const getPengirimBarang = async (reportId) => {
    return PengirimBarang.findOne({ where: { reportId: reportId } });;
}

const savePengirimBarang = async(data, transaction) => {
    try {
        return PengirimBarang.create(data, {
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
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else if(error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data", error);
        }
    }
}

module.exports = {
    savePengirimBarang,
    updatePengirimBarangRepo,
    getPengirimBarang
}