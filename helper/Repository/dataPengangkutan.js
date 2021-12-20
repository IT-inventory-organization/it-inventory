const DataPengangkutan = require("../../database/models/data_pengangkutan");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")
const { isExist } = require('../checkExistingDataFromTable');

const getDataPengangkutan = async (reportId) => {
    const data = await DataPengangkutan.findOne({ where: { reportId: reportId } });
    return data;
}

const saveDataPengangkutan = async(data, transaction) => {
    try {
        const result = await DataPengangkutan.create(data, {
            transaction,
            returning: true
        });

        return result;
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
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
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server')
        }else if(error.name == 'ServerFault' || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData('Gagal Mengubah Data')
        }
    }
}

module.exports = {
    saveDataPengangkutan,
    updateDataPengangkutanRepo,
    getDataPengangkutan
}