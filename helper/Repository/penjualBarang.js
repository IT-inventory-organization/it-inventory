const PenjualBarang = require("../../database/models/penjual_barang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const getPenjualBarang = async (reportId) => {
    return PenjualBarang.findOne({ where: { reportId: reportId } });
}

const savePenjualBarang = async(data, transaction) => {
    try { 
        return PenjualBarang.create(data, {
            transaction, 
            returning: true
        });
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error);
        }
    }
}

const updatePenjualBarangRepo = async(data, reportId, transaction) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId
            }
        }

        await isExist(PenjualBarang, query);

        const result = await PenjualBarang.update(data, {
            ...query,
            transaction,
            returning:true,
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
    savePenjualBarang,
    updatePenjualBarangRepo,
    getPenjualBarang
}