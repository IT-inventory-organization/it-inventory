const ppjk = require("../../database/models/ppjk")
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler")
const { isExist } = require('../checkExistingDataFromTable');

const getDataPpjk = async (reportId) => {
    const data = await ppjk.findOne({ where: { reportId: reportId } });
    return data;
}

const saveDataPpjk = async(data, transaction) => {
    try {
        const result = await ppjk.create(data, {
            transaction,
            returning: true
        })

        return result;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server")
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data")
        }
    }
}

const updateDataPpjkRepo = async(data,  reportId, transaction) => {
    try {
        console.log(data)
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
        console.log(error)
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server');
        }else if(error.name == 'ServerFault' || error.name == 'NotFoundException') {
            throw error
        } else {
            throw new ConflictCreateData('Gagal Saat Mengubah data')
        }
    }
}

module.exports = {
    saveDataPpjk,
    updateDataPpjkRepo,
    getDataPpjk
}