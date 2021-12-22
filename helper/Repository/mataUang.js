const MataUang = require("../../database/models/mata_uang");
const { ForeignKeyViolation, ConflictCreateData, BadRequest } = require("../../middlewares/errHandler");
const { isExist } = require('../checkExistingDataFromTable')

const getMataUang = async (reportId) => {
    return MataUang.findOne({ where: { reportId: reportId } });
}

const saveMataUang = async(data, transaction) => {
    try {
        return await MataUang.create(data, {
            transaction,
            returning: true
        });
    } catch (error) {
        // console.log(error)
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else if(error.name == "SequelizeDatabaseError"){
            throw new BadRequest("Inputan User Salah", error)
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error);
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
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Data Server', error);
        }else if(error.name == 'ServerFault' || error.name == 'NotFoundException'){
            throw error
        } else if(error.name == "SequelizeDatabaseError"){
            throw new BadRequest("Inputan User Salah", error)
        }else {
            throw new ConflictCreateData('Gagal Mengubah Data', error)
        }
    }
}

module.exports = {
    saveMataUang,
    updateMataUangRepo,
    getMataUang
}