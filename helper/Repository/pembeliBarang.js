const PembeliBarang = require("../../database/models/pembeli_barang");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const getPembeliBarang = async (reportId) => {
    const data = await PembeliBarang.findOne({ where: { reportId: reportId } });
    return data;
}

const savePembeliBarang = async(data, transaction) => {
    try {
        const result = await PembeliBarang.create(data,{
            transaction,
            returning: true
        })

        return result
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server")
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

const updatePembeliBarangRepo = async(data, reportId, transaction) => {
    try {
        console.log(data)
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
        console.log(error)
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
    savePembeliBarang,
    updatePembeliBarangRepo,
    getPembeliBarang
}