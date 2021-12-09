const PenjualBarang = require("../../database/models/penjual_barang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const getPenjualBarang = async (reportId) => {
    const data = await PenjualBarang.findOne({ where: { reportId: reportId } });
    return data;
}

const savePenjualBarang = async(data, transaction) => {
    try {
        const result = await PenjualBarang.create(data, {
            transaction, 
            returning: true
        });
        return result;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
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
        // console.log(error)
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
    savePenjualBarang,
    updatePenjualBarangRepo,
    getPenjualBarang
}