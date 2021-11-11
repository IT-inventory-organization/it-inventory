const { errorResponse, successResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');
const { 
    formatDataDokumenMasukan, 
    formatDataDokumenTambahan, 
    formatDataDokumenPelabuhan,
    formatDataDokumenKapal
} = require('../../middlewares/dataDokumenMiddleware/reformatDataDokumen');
const { 
    vDataPengajuan, 
    vDataTambahan, 
    vDataPelabuhan, 
    vDataKapal
} = require('../../middlewares/dataDokumenMiddleware/validationDataDokumen');
const { validationResponse } = require('../../middlewares/validationResponse');
const { saveDataPengajuan } = require('../../helper/Repository/dataPengajuan');
const sequelize = require('../../configs/database');
const authentication = require('../../middlewares/authentication');
const { saveDataTambahan } = require('../../helper/Repository/dataTambahan');
const { saveDataPelabuhan } = require('../../helper/Repository/dataPelabuhan');
const { saveDataKapal } = require('../../helper/Repository/dataKapal');

const saveDokumenPemasukan = async(req, res) => {
    let transaction;
    try {
        const {ref} = req.body;
        // console.log(ref);return;
        transaction = await sequelize.transaction();
        let resultSaved = [];
        /**
         * 
         */
        const resultDataPemasukan = await saveDataPengajuan(ref.dataPemasukan, transaction);
        const resultDataTambahan = await saveDataTambahan(ref.dataTambahan, transaction);
        const resultDataPelabuhan = await saveDataPelabuhan(ref.dataPelabuhan, transaction);
        const resultDataKapal = await saveDataKapal(ref.dataKapal, transaction);
        /**
         * 
         */
        
        const data = {
            dataPengajuan: resultDataPemasukan.id,
            dataTambahan: resultDataTambahan.id,
            dataPelabuhan: resultDataPelabuhan.id,
            dataKapal: resultDataKapal.id
        }
        await transaction.commit();
        if(req.currentRole){}

        return successResponse(res, Http.created, "Berhasil Menyimpan Data Dokumen", data);
    } catch (error) {
        console.log(error)
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, error.status, error.message);

    }
}


module.exports = routes => {
    routes.post('/save/pemasukan',
        authentication,
        formatDataDokumenMasukan, 
        formatDataDokumenTambahan,
        formatDataDokumenPelabuhan,
        formatDataDokumenKapal,
        vDataPengajuan,
        vDataTambahan,
        vDataPelabuhan,
        vDataKapal,
        validationResponse, 
        saveDokumenPemasukan
    );
}