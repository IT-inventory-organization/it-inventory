const PengusahaPLB = require("../../database/models/pengusaha_plb");
const {isExist} = require('../checkExistingDataFromTable');
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");

const getPengusahaPLB = async (reportId) => {
    const data = await PengusahaPLB.findOne({ where: { reportId: reportId } });
    return data;
}

const savePengusahaPLB = async(data, transaction) => {
    try {
        const result = await PengusahaPLB.create(data, {
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

const updatePengusahaPLBRepo = async(data, reportId, transaction) => {
    try {
        const query = {
            where:{
                id: data.id,
                reportId
            }
        }

        await isExist(PengusahaPLB, query);

        const result = await PengusahaPLB.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        })

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
    savePengusahaPLB,
    updatePengusahaPLBRepo,
    getPengusahaPLB
}