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
    validationDataTempatPenimbunan
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
    idReport
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
const { updateListBarang, softDeleteListBarang, createListBarang } = require('../../helper/ListBarang');
const { updateListDokumen, softDeleteListDokumen, createListDokumen } = require('../../helper/ListDokumen');
const { updateDataPetiKemas } = require('../../helper/DataPetiKemas');
const { dataBarang } = require('../../helper/bundleDataBarang');
const { dataDokumen,petiKemas } = require('../../helper/bundleDataLanjutan');
const { validationArrListDokumen,validationPetiKemas } = require('../../middlewares/validationDataLanjutan');
const { validationArrListBarang } = require('../../middlewares/validationDataBarang');
const Http = require('../../helper/Httplib');
const sequelize = require('../../configs/database');
const authentication = require('../../middlewares/authentication');
const { createUserActivity } = require('../../helper/UserActivity');
const { updateReport, updateStatus } = require('../../helper/DataReport');
const validationReport = require('../../middlewares/validationDataReport')

const updateDataHeader = async (req, res) => {
    let transaction;
    try {
        const {id} = req.params;
        transaction = await sequelize.transaction();

        const {DataToInput: {
            pengajuan, 
            identitasPengirim, 
            identitasPenerima, 
            transaksiPerdagangan,
            pengangkutan,
            pelabuhanMuatBongkar, 
            beratDanVolume, 
            petiKemasDanPengemas, 
            tempatPenimbunan, 
            perkiraanTanggalPengeluaran, 
            dataSearchReport
        }} = req;

        const { dataPengajuanId, identitasPenerimaId, identitasPengirimId, transaksiPerdaganganId, pengangkutanId, pelabuhanMuatBongkarId, beratDanVolumeId, petiKemasDanPengemasId, tempatPenimbunanId, perkiraanTanggalId } = dataSearchReport;
        // return;
        const dataPengajuanUpdate = await updateDataPengajuan(pengajuan, dataPengajuanId, id, false, transaction);
        const identitasPengirimUpdate = await updateReportIdentitasPengirim(identitasPengirim, identitasPengirimId, id, false, transaction);
        const identitasPenerimaUpdate = await updateReportIdentitasPenerima(identitasPenerima, identitasPenerimaId, id, false, transaction);
        const transaksiPerdaganganUpdate = await updateReportTransaksiPerdagangan(transaksiPerdagangan, transaksiPerdaganganId, id, false, transaction);
        
        const dataPengangkutanUpdate = await updateDataPengangkutan(pengangkutan, pengangkutanId, id, false, transaction); // Success
        const pelabuhanMuatBongkarUpdate = await updateDataPelabuhanMuatBongkar(pelabuhanMuatBongkar, pelabuhanMuatBongkarId, id, false, transaction); 
        const beratDanVolumeUpdate = await updateDataBeratDanVolume(beratDanVolume, beratDanVolumeId, id ,false, transaction);
        const petiKemasDanPengemasUpdate = await updateDataPetiKemasDanPengemas(petiKemasDanPengemas, petiKemasDanPengemasId, id, false, transaction);
        const tempatPenimbunanUpdate = await updateDataTempatPenimbunan(tempatPenimbunan, tempatPenimbunanId, id, false, transaction);
        const perkiraanTanggalPengeluaranUpdate = await updatePerkiraanTanggalPengeluaran(perkiraanTanggalPengeluaran, perkiraanTanggalId, id, true, transaction);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, id, `Updating "Data Header" Report`);
        }

        await transaction.commit();
        return successResponse(res, Http.created, "Success Updating Report", perkiraanTanggalPengeluaranUpdate);
    } catch (error) {
        console.error(error)
        await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Failed To Edit The Report", error);
    }
}

const updateDataLanjutan = async (req, res) => {
    const {idReport} = req.params;
    let transaction;
    try {

        transaction = await sequelize.transaction();
        const {DataToInput: {listDokumen, petiKemas}} = req;

        await softDeleteListDokumen(idReport);
        let promises = [];

        for (let i = 0; i < listDokumen.length; i++) {
            const element = listDokumen[i];
            promises.push(await createListDokumen(element, transaction));
        }

        const petiKemasResult = await updateDataPetiKemas(petiKemas, idReport, false, transaction);

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
        console.error(error)
        return errorResponse(res, Http.internalServerError, "Failed To Update Document");
    }
}

const updateDataBarang = async (req, res) => {
    let transaction;
    const {idReport} = req.params;
    try {
        const {DataToInput: {listBarang}} = req;

        transaction = await sequelize.transaction();

        await softDeleteListBarang(idReport, transaction);
        
        const promises = [];

        for(let i = 0; i < listBarang.length; i++) {
            promises.push(await createListBarang(listBarang[i], transaction));
        }
        // const dataBarangUpdate = await updateListBarang(listBarang, req.params.id, true, null);

        const dataToReturn = {
            listBarang: promises.map(el => el.id),
            reportId: promises[0].id
        }

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, idReport, `Updating "Data Barang" Report`);
        }
        await transaction.commit();
        return successResponse(res, Http.created, 'Success Update Item', dataToReturn);
    } catch (error) {
        await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Failed To Update Item")
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
        const dataObj = {
            pengajuanSebagai: req.body.pengajuanSebagai,
            kantorPengajuan: req.body.kantorPengajuan,
            jenisPemberitahuan: req.body.jenisPemberitahuan,
            jenisKeluar: req.body.jenisKeluar,
            userId: req.currentUser,
            typeReport: req.body.typeReport,
            BCDocumentType: req.body.BCDocumentType,
            isDelete: false
        };

        const result = await updateReport(id, dataObj);

        return successResponse(res, Http.created, "Success Update Report");
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Failed Update Report")
    }
}

module.exports = (routes) => {
    routes.put('/:id', 
        authentication,
        validationReport,
        validationResponse,
        updateReportPerId
    );

    routes.put(
        '/data-header/:id',
        authentication,
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
        validationResponse,
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
        idReport,
        updateDataHeader
    );

    routes.put('/data-barang/:idReport',
        authentication,
        validationArrListBarang,
        validationResponse,
        dataBarang,
        updateDataBarang
    );

    routes.put('/data-lanjutan/:idReport',
        authentication,
        validationArrListDokumen,
        validationPetiKemas,
        validationResponse,
        dataDokumen,
        petiKemas,
        updateDataLanjutan
    );

    routes.put('/updateStatus/:id', authentication, updateStatusInvetory);
}