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
    idReport,
    dataLartas
} = require('../../helper/bundleDataReportHeader');
const { errorResponse, successResponse } = require('../../helper/Response');
const { validationResponse } = require('../../middlewares/validationResponse');
const { updateDataPengajuan } = require('../../helper/DataPengajuan');
const { updateReportIdentitasPengirim } = require('../../helper/IdentitasPengirim');
const { updateReportIdentitasPenerima } = require('../../helper/IdentitasPenerima');
const { updateReportTransaksiPerdagangan } = require('../../helper/TransaksiPerdagangan');
const { updateDataPengangkutan } = require('../../helper/DataPengangkutan');
const { updateDataPelabuhanMuatBongkar } = require('../../helper/DataPelabuhanMuatBongkar');
const { updateDataBeratDanVolume } = require('../../helper/DataBeratDanVolume');
const { updateDataPetiKemasDanPengemas } = require('../../helper/DataPetiKemasDanPengemas');
const { updateDataTempatPenimbunan } = require('../../helper/DataTempatPenimbunan');
const { updatePerkiraanTanggalPengeluaran }= require('../../helper/DataPerkiraanTanggalPengeluaran');
const { softDeleteListBarang, createListBarang } = require('../../helper/ListBarang');
const { softDeleteListDokumen, createListDokumen } = require('../../helper/ListDokumen');
const { updateDataPetiKemas } = require('../../helper/DataPetiKemas');
const { dataBarang } = require('../../helper/bundleDataBarang');
const { dataDokumen,petiKemas } = require('../../helper/bundleDataLanjutan');
const { validationArrListDokumen,validationPetiKemas } = require('../../middlewares/validationDataLanjutan');
const { validationArrListBarang } = require('../../middlewares/validationDataBarang');
const Http = require('../../helper/Httplib');
const sequelize = require('../../configs/database');
const authentication = require('../../middlewares/authentication');
const { createUserActivity } = require('../../helper/UserActivity');
const { updateReport, updateStatus, checkAuthorization } = require('../../helper/DataReport');
const validationReport = require('../../middlewares/validationDataReport');
const { bundleReport } = require('../../helper/bundleReport');
const { updateDataLartas } = require('../../helper/DataLartas');

const updateDataHeader = async (req, res) => {
    let transaction;
    try {
        const {id} = req.params;
        transaction = await sequelize.transaction();

        const { DataToInput: {dataPengajuan, identitasPengirim, identitasPenerima, transaksiPerdagangan, dataPengangkutan, dataPelabuhanMuatBongkar, dataBeratDanVolume, dataPetiKemasDanPengemas, dataLartas, dataTempatPenimbunan, dataPerkiraanTanggalPengeluaran}} = req.body;
    
        await checkAuthorization(req, id, transaction)

        // const { dataPengajuanId, identitasPenerimaId, identitasPengirimId, transaksiPerdaganganId, pengangkutanId, pelabuhanMuatBongkarId, beratDanVolumeId, petiKemasDanPengemasId, dataLartasId, tempatPenimbunanId, perkiraanTanggalId } = dataSearchReport; 
        
        const dataPengajuanUpdate = await updateDataPengajuan(dataPengajuan, id, false, transaction);
        const identitasPengirimUpdate = await updateReportIdentitasPengirim(identitasPengirim, id, false, transaction);
        const identitasPenerimaUpdate = await updateReportIdentitasPenerima(identitasPenerima, id, false, transaction);
        const transaksiPerdaganganUpdate = await updateReportTransaksiPerdagangan(transaksiPerdagangan, id, false, transaction);
        
        const dataPengangkutanUpdate = await updateDataPengangkutan(dataPengangkutan, id, false, transaction); // Success
        const pelabuhanMuatBongkarUpdate = await updateDataPelabuhanMuatBongkar(dataPelabuhanMuatBongkar, id, false, transaction); 
        const beratDanVolumeUpdate = await updateDataBeratDanVolume(dataBeratDanVolume, id ,false, transaction);
        const petiKemasDanPengemasUpdate = await updateDataPetiKemasDanPengemas(dataPetiKemasDanPengemas, id, false, transaction);
        const dataLartasUpdate = await updateDataLartas(dataLartas, id, false, transaction);
        const tempatPenimbunanUpdate = await updateDataTempatPenimbunan(dataTempatPenimbunan, id, false, transaction);
        const perkiraanTanggalPengeluaranUpdate = await updatePerkiraanTanggalPengeluaran(dataPerkiraanTanggalPengeluaran, id, true, transaction);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, id, `Updating "Data Header" Report`);
        }

        await transaction.commit();
        return successResponse(res, Http.created, "Success Updating Report", perkiraanTanggalPengeluaranUpdate);
    } catch (error) {
        await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Failed To Update Report");
    }
}

const updateDataLanjutan = async (req, res) => {
    const {idReport} = req.params;
    let transaction;
    try {

        transaction = await sequelize.transaction();
        const {DataToInput: {dataDokumen, dataPetiKemas}} = req.body;

        await softDeleteListDokumen(idReport, req, transaction);
        let promises = [];
        
        for (let i = 0; i < dataDokumen.length; i++) {
            const element = dataDokumen[i];
            if(element.id){
                delete element.id;
            }
            promises.push(await createListDokumen(element, transaction));
        }

        const petiKemasResult = await updateDataPetiKemas(dataPetiKemas, idReport, false, transaction);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, idReport, `Updating "Data Lanjutan" Report`);
        }
        await transaction.commit();
        
        return successResponse(res, Http.created, "Success Updating Peti Kemas", {
            listDokumen: promises.map(el => el.id),
            petiKemasResult: petiKemasResult.id,
            reportId: promises[0].reportId
        })
    } catch (error) {
        await transaction.rollback();
        return errorResponse(res, Http.internalServerError, error.message);
    }
}

const updateDataBarang = async (req, res) => {
    let transaction;
    const {idReport} = req.params;
    
    try {
        transaction = await sequelize.transaction();
        const {DataToInput: {listDataBarang}} = req.body;

        await softDeleteListBarang(idReport, req, transaction);
        // return;
        const promises = [];

        for(let i = 0; i < listDataBarang.length; i++) {
            if(listDataBarang[i].id){
                delete listDataBarang[i].id;
            }
            promises.push(await createListBarang(listDataBarang[i], transaction));
        }

        const dataToReturn = {
            listDataBarang: promises.map(el => el.id),
            reportId: promises[0].id
        }

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, idReport, `Updating "Data Barang" Report`);
        }

        await transaction.commit();
        return successResponse(res, Http.created, 'Success Update Item', dataToReturn);
    } catch (error) {
        await transaction.rollback();
        return errorResponse(res, Http.internalServerError, error.message);
    }
}

const updateStatusInvetory = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if(req.currentRole !== 'Admin'){
            throw new Error(`${req.currentRole} Cannot Updating Status`);
        }

        await updateStatus(id, status);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, id, `Updating Status Report`);
        }

        return successResponse(res, Http.created, "Success Updating Status");
    } catch (error) {
        return errorResponse(res, Http.internalServerError, error.message);
    }
}

const updateReportPerId = async (req, res) => {
    const { id } = req.params;
    try {

        const result = await updateReport(id, req.body.DataToInput);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, id, `Updating Report`);
        }

        return successResponse(res, Http.created, "Success Update Report");
    } catch (error) {
        return errorResponse(res, Http.internalServerError, error.message)
    }
}

module.exports = (routes) => {
    routes.put('/:id', 
        authentication,
        bundleReport,
        validationReport,
        validationResponse,
        updateReportPerId
    );

    routes.put(
        '/data-header/:id',
        authentication,
        dataPengajuan,
        identitasPengirim,
        identitasPenerima,
        transaksiPerdagangan,
        dataPengangkut,
        dataPelabuhanMuatBongkar,
        beratDanVolume,
        dataPetiKemasDanPengemas,
        dataPerkiraanTanggalPengeluaran,
        dataTempatPenimbunan,
        dataLartas,
        // idReport,
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
        validationDataLartas,
        validationResponse,
        updateDataHeader
    );

    routes.put('/data-barang/:idReport',
        authentication,
        dataBarang,
        validationArrListBarang,
        validationResponse,
        updateDataBarang
    );

    routes.put('/data-lanjutan/:idReport',
        authentication,
        dataDokumen,
        petiKemas,
        validationArrListDokumen,
        validationPetiKemas,
        validationResponse,
        updateDataLanjutan
    );

    routes.put('/updateStatus/:id', authentication, updateStatusInvetory);
}