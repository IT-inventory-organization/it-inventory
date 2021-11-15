const DokumenPemasukan = require("../../database/models/dokumen_pemasukan");
const { ForeignKeyViolation, ConflictCreateData } = require("../../middlewares/errHandler");
const { isExist } = require("../checkExistingDataFromTable");

const saveDataPengajuan = async (data, transaction) => {
    try {
        
        const result = await DokumenPemasukan.create(data, {
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

const updateDataPengajuan = async(data, transaction) => {
    try {
        const query = {
            where:{
                id: data.id
            }
        }

        isExist(DokumenPemasukan, query);
        return;
        const result = await DokumenPemasukan.update(data, {
            query,
            transaction,
            returning: true
        });

        return result;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server")
        }else if(error.name == 'ServerFault' || error.name == 'NotFoundException'){
            throw error
        }else{
            throw new ConflictCreateData('Gagal Menyimpan Data')
        }
    }
}

module.exports = {
    saveDataPengajuan,
    updateDataPengajuan
}