const DataPengangkutan = require("../../database/models/data_pengangkutan");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")
const { isExist } = require('../checkExistingDataFromTable');

const getDataPengangkutan = async (reportId) => {
    return DataPengangkutan.findOne({ where: { reportId: reportId } });
}

const saveDataPengangkutan = async(data, transaction) => {
    try {
        return DataPengangkutan.create(data, {
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

const updateDataPengangkutanRepo = async(data, reportId, transaction) => {
    try {

        const query = {
            where: {
                id: data.id,
                reportId
            }
        }
        
        await isExist(DataPengangkutan, query);

        const result = await DataPengangkutan.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        })

        return result[1].toJSON();
    } catch (error) {

        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server', error)
        }else if(error.name == 'ServerFault' || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData('Gagal Mengubah Data', error)
        }
    }
}

module.exports = {
    saveDataPengangkutan,
    updateDataPengangkutanRepo,
    getDataPengangkutan
}