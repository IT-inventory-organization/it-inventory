const ppjk = require("../../database/models/ppjk")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")
const { isExist } = require('../checkExistingDataFromTable');

const getDataPpjk = async (reportId) => {
    return ppjk.findOne({ where: { reportId: reportId } });
}

const saveDataPpjk = async(data, transaction) => {
    try {
        
        return ppjk.create(data, {
            transaction,
            returning: true
        });
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error)
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error)
        }
    }
}

const updateDataPpjkRepo = async(data,  reportId, transaction) => {
    try {

        const query = {
            where: {
                id: data.id,
                reportId
            }
        }

        await isExist(ppjk, query);

        const result = await ppjk.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        })

        return result[1].toJSON();
    } catch (error) {

        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server', error);
        }else if(error.name == 'ServerFault' || error.name == 'NotFoundException') {
            throw error
        } else {
            throw new ConflictCreateData('Gagal Saat Mengubah data', error)
        }
    }
}

module.exports = {
    saveDataPpjk,
    updateDataPpjkRepo,
    getDataPpjk
}