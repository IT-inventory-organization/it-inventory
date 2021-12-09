const dataPO = require('../../database/models/po');
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const { isExist } = require("../checkExistingDataFromTable");

const saveDataPO = async(data, transaction) => {
    try {
        const res = await dataPO.create(data, {
            transaction,
            returning: true
        })
        return res;
    } catch (error) {
        console.log(error)
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server')
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data")
        }
    }
}

const updateDataPO = async(data, query, transaction) => {
    try {
        await isExist(dataPO, query);
        const result = await dataPO.update(data, {
            ...query,
            transaction,
            returning: true,
            // plain: true
        })

        // return result[1].toJSON();
        return result[1];
    } catch (error) {
        console.log(error)
        if (error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        } else if (error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data");
        }
    }
}

module.exports = {
    saveDataPO,
    updateDataPO
}