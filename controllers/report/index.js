const Http = require('../../helper/Httplib');
const { createReport } = require('../../helper/DataReport');
const { createDataPengajuan } = require('../../helper/DataPengajuan');
const { createReportIdentitasPenerima } = require('../../helper/IdentitasPenerima');
const { createReportIdentitasPengirim } = require('../../helper/IdentitasPengirim');
const { createReportTransaksiPerdagangan } = require('../../helper/TransaksiPerdagangan');
const { errorResponse, successResponse } = require('../../helper/Response');
const { validationResponse } = require('../../middlewares/validationResponse');
const {
    dataPengajuan,
    identitasPenerima,
    identitasPengirim,
    transaksiPerdagangan,
    dataPengangkut,
    dataPelabuhanMuatBongkar,
    beratDanVolume,
    dataPetiKemasDanPengemas,
    dataPerkiraanTanggalPengeluaran,
    dataTempatPenimbunan,
    dataLartas
} = require('../../helper/bundleDataReportHeader');

const sequelize = require('../../configs/database')
const {
    validationDataPengajuan, 
    validationIdentitasPengirim, 
    validationIdentitasPenerima,
    validationTransaksiPerdagangan,
    validationDataPengangkutan,
    validationDataPelabuhanMuatBongkar,
    validationBeratDanVolume,
    validationDataPetiKemasDanPengemas,
    validationDataPerkiraanTanggalPengeluaran,
    validationDataTempatPenimbunan,
    validationDataLartas
} = require('../../middlewares/validationDataHeader');

const validationReport = require('../../middlewares/validationDataReport')
const { validationArrListDokumen, validationPetiKemas } = require('../../middlewares/validationDataLanjutan');
const { dataBarang } = require('../../helper/bundleDataBarang');
const { dataDokumen, petiKemas } = require('../../helper/bundleDataLanjutan');
const { createDataPengangkutan } = require('../../helper/DataPengangkutan');
const { createDataPelabuhanMuatBongkar } = require('../../helper/DataPelabuhanMuatBongkar');
const { createDataBeratDanVolume } = require('../../helper/DataBeratDanVolume');
const { createDataPetiKemasDanPengemas } = require('../../helper/DataPetiKemasDanPengemas');
const { createDataTempatPenimbunan } = require('../../helper/DataTempatPenimbunan');
const { createPerkiraanTanggalPengeluaran } = require('../../helper/DataPerkiraanTanggalPengeluaran');
const { createListDokumen } = require('../../helper/ListDokumen');
const { createDataPetiKemas } = require("../../helper/DataPetiKemas");
const { createListBarang } = require("../../helper/ListBarang");
const { validationArrListBarang }= require("../../middlewares/validationDataBarang");
const authentication = require('../../middlewares/authentication');
const Encryption = require('../../helper/encription');
const { createUserActivity } = require('../../helper/UserActivity');
const { bundleReport } = require('../../helper/bundleReport');
const { createDataLartas } = require('../../helper/DataLartas');

const addReport = async (req, res) => {
    try {

        const result = await createReport(req.body.DataToInput, null);
        const dataReturn = {
            id: result.id,
            userId: result.userId
        };

        if(req.currentRole !== "Owner"){
            await createUserActivity(req.currentUser, result.id, "Create New Report");
        }

        return successResponse(res, Http.created, "Success Adding A Report", dataReturn)
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Failed To Add A Report", error);
    }
}

// Callback Add Data Header
const addDataHeader = async (req, res) => {
    let transaction
    
    try {
        transaction = await sequelize.transaction();

        const { DataToInput: {dataPengajuan, identitasPengirim, identitasPenerima, transaksiPerdagangan, dataPengangkutan, dataPelabuhanMuatBongkar, dataBeratDanVolume, dataPetiKemasDanPengemas, dataLartas, dataTempatPenimbunan, dataPerkiraanTanggalPengeluaran}} = req.body;
        
        const dataPengajuanResult = await createDataPengajuan(dataPengajuan, transaction); // Simpan Ke Table Data Pengajuan
    
        const identitasPenerimaResult = await createReportIdentitasPenerima(identitasPenerima, transaction); // Simpan Ke Table Identitas Penerima

        const identitasPengirimResult = await createReportIdentitasPengirim(identitasPengirim, transaction); // Simpan Ke Table Identitas Pengirim
   
        const transaksiPerdaganganResult = await createReportTransaksiPerdagangan(transaksiPerdagangan, transaction); // Simpan Ke Table Transaksi 
    
        const pengangkutanResult = await createDataPengangkutan(dataPengangkutan, transaction);
      
        const pelabuhanMuatBongkarResult = await createDataPelabuhanMuatBongkar(dataPelabuhanMuatBongkar, transaction);
     
        const beratDanVolumeResult = await createDataBeratDanVolume(dataBeratDanVolume, transaction);
     
        const petiKemasDanPengemasResult = await createDataPetiKemasDanPengemas(dataPetiKemasDanPengemas, transaction);

        const tempatPenimbunanResult = await createDataTempatPenimbunan(dataTempatPenimbunan, transaction);
  
        const dataLartasResult = await createDataLartas(dataLartas, transaction);
     
        const perkiraanTanggalResult = await createPerkiraanTanggalPengeluaran(dataPerkiraanTanggalPengeluaran, transaction);
        
        const dataToReturn = {
            dataPengajuanId: dataPengajuanResult.id,
            reportId: dataPengajuanResult.reportId,
            identitasPenerimaId: identitasPenerimaResult.id,
            identitasPengirimId: identitasPengirimResult.id,
            transaksiPerdaganganId: transaksiPerdaganganResult.id,
            pengangkutanId: pengangkutanResult.id,
            pelabuhanMuatBongkarId: pelabuhanMuatBongkarResult.id,
            beratDanVolumeId: beratDanVolumeResult.id,
            petiKemasDanPengemasId: petiKemasDanPengemasResult.id,
            tempatPenimbunanId: tempatPenimbunanResult.id,
            dataLartasId: dataLartasResult.id,
            perkiraanTanggalId: perkiraanTanggalResult.id
        };

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, dataPengajuan.reportId, `Create Report "Data Header"`);
        }


        await transaction.commit();

        return successResponse(res, Http.created, "Success Adding Data Header", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return errorResponse(res, Http.internalServerError, "Failed To Add Data")
    }
}

// Callback Add Data Lanjutan
const addDataLanjutan = async (req, res) => {
    let transaction

    try {
        console.log(req);
        transaction = await sequelize.transaction();

        const { DataToInput: {dataDokumen, dataPetiKemas}} = req.body;
        
        const promises = [];

        for (let i = 0; i < dataDokumen.length; i++) {
            let result = await createListDokumen(dataDokumen[i], transaction);
            promises.push(result)  
        }
        
        const petiKemasResult = await createDataPetiKemas(dataPetiKemas, transaction)

        const dataToReturn = {
            dataDokumen: promises.map(el => el.id),
            reportId: petiKemas.reportId,
            dataPetiKemas: petiKemasResult.id,
        };

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, dataPetiKemas.reportId, `Create Report "Data Lanjutan"`);
        }

        await transaction.commit();

        return successResponse(res, Http.created, "Success Adding Data Lanjutan", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return errorResponse(res, Http.internalServerError, "Failed To Add Data", error)
    }
}

// Callback Add Data Barang
const addDataBarang = async (req, res) => {
    let transaction
    
    try {
        transaction = await sequelize.transaction();
        const { DataToInput: {listDataBarang, reportId}} = req.body;
        
        const promises = [];
        // listBarang.forEach(async el => {
        //     promises.push(await createListBarang(el, transaction));
        // })

        // const result = await Promise.all(promises);
        // Loop Dengan Async
        for (let index = 0; index < listDataBarang.length; index++) {
            let res = await createListBarang(listDataBarang[index], transaction);
            promises.push(res);
        }
        
        const dataToReturn = {
            listDataBarang: promises.map( ele => ele.id),
            reportId: reportId,
        };

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, reportId, `Create Report "Data Barang"`);
        }

        await transaction.commit()

        return successResponse(res, Http.created, "Success Adding List Barang", dataToReturn);
    } catch (error) {
        await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Failed To Add Data", error)
    }
}

/**
 * Testing Purpose 
 */
const decrypt = async(req, res) => {
    res.json(
        Encryption.AESDecrypt(req.body.tes)
    )
}

module.exports = (routes) => {
    // Create report
    routes.post('/', // --> url
        authentication,
        bundleReport,
        validationReport,
        validationResponse,
        addReport
    );

    // Create Data Header
    routes.post('/data-header',
        authentication,
        dataPengajuan,
        identitasPengirim,
        identitasPenerima,
        transaksiPerdagangan,
        dataPengangkut,
        dataPelabuhanMuatBongkar,
        beratDanVolume,
        dataPetiKemasDanPengemas,
        dataTempatPenimbunan,
        dataPerkiraanTanggalPengeluaran,
        dataLartas,
        validationDataPengajuan,
        validationIdentitasPengirim,
        validationIdentitasPenerima,
        validationTransaksiPerdagangan,
        validationDataPengangkutan,
        validationDataPelabuhanMuatBongkar,
        validationBeratDanVolume,
        validationDataPetiKemasDanPengemas,
        validationDataTempatPenimbunan,
        validationDataPerkiraanTanggalPengeluaran,
        validationDataLartas,
        validationResponse, // --> Middleware
        addDataHeader
    );

    // Create Data Lanjutan
    routes.post('/data-lanjutan',
        authentication,
        dataDokumen,
        petiKemas,
        validationArrListDokumen,
        validationPetiKemas,
        validationResponse,
        addDataLanjutan
    );

    // Create Data Barang
    routes.post('/data-barang',
        authentication,
        dataBarang,
        validationArrListBarang,
        validationResponse,
        addDataBarang
    );
    
    /**
     * Testign purpose
     * Check Hasil Decrypt
     */
    routes.post('/test', decrypt);
}