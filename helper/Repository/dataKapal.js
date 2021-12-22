const DataKapal = require("../../database/models/data_kapal");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const getDataKapal = async (reportId) => {
    const data = await DataKapal.findOne({ where: { reportId: reportId } });
    return data;
}

const saveDataKapal = async (data, transaction) => {
    try {
        return DataKapal.create(data, {
            transaction,
            returning: true
        });
    } catch (error) {
        console.log(error,"saveDataKapal")
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation('TErjadi Kesalahan Pada Server', error);
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error);
        }
    }
}

const updateDataKapalRepo = async(data, reportId, transaction) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId
            }
        }

        await isExist(DataKapal,query);

        const result = await DataKapal.update(data, {
            ...query,
            transaction,
            returning: true,
            plain:true
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
    saveDataKapal,
    updateDataKapalRepo,
    getDataKapal
}