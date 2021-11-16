const DataPelabuhan = require("../../database/models/data_pelabuhan")
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const { isExist } = require("../checkExistingDataFromTable");

const saveDataPelabuhan = async(data, transaction) => {
    try {
        const result = await DataPelabuhan.create(data, {
            transaction,
            returning: true
        });
        return result;
    } catch (error) {
        if(error.name === 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server")
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data")
        }

    }
}

const updateDataPelabuhanRepo = async(data, reportId, transaction) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId
            }
        }
        await isExist(DataPelabuhan, query)

        const result = await DataPelabuhan.update(data, {
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
    saveDataPelabuhan,
    updateDataPelabuhanRepo
}