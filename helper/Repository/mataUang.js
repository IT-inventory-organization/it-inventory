const MataUang = require("../../database/models/mata_uang");
const { ForeignKeyViolation, ConflictCreateData, NotFoundException } = require("../../middlewares/errHandler");
const { isExist } = require('../checkExistingDataFromTable')

const getMataUang = async (reportId) => {
    const data = await MataUang.findOne({ where: { reportId: reportId } });
    return data;
}

const saveMataUang = async(data, transaction) => {
    try {
        const result = await MataUang.create(data, {
            transaction,
            returning: true
        })

        return result;
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data");
        }
    }
}

const updateMataUangRepo = async(data, reportId, transaction) => {
    try {

        const query = {
            where:{
                id: data.id,
                reportId
            }
        }

        await isExist(MataUang, query);

        const result = await MataUang.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        })

        return result[1].toJSON();
    } catch (error) {

        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation('Terjadi KKesalahan Pada Data Server');
        }else if(error.name == 'ServerFault' || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData('Gagal Mengubah Data')
        }
    }
}

module.exports = {
    saveMataUang,
    updateMataUangRepo,
    getMataUang
}