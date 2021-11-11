const { errorResponse, successResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');
const { formatDataDokumen } = require('../../middlewares/reformatDataDokumen');
const { vDataPengajuan } = require('../../middlewares/validationDataDokumen');
const { validationResponse } = require('../../middlewares/validationResponse');
const { saveDataPengajuan } = require('../../helper/Repository/dataPengajuan');
const sequelize = require('../../configs/database');
const authentication = require('../../middlewares/authentication');

const saveDokumenPemasukan = async(req, res) => {
    let transaction;
    try {
        const {ref} = req.body;
        // console.log(ref);return;
        transaction = await sequelize.transaction();
        // let resultSaved = [];
        /**
         * 
         */
        const resultDataPemasukan = await saveDataPengajuan(ref.dataPengajuan, transaction);

        /**
         * 
         */
        await transaction.commit();

        const data = {
            dataPengajuan: resultDataPemasukan.id
        }
        
        if(req.currentRole){}

        return successResponse(res, Http.created, "Berhasil Menyimpan Data Dokumen", data);
    } catch (error) {
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, Http.internalServerError, "Gagal Menyimpan Data Dokumen Pemasukan");
    }
}


module.exports = routes => {
    routes.post('/save/pemasukan',
        authentication,
        formatDataDokumen, 
        vDataPengajuan, 
        validationResponse, 
        saveDokumenPemasukan
    );
}