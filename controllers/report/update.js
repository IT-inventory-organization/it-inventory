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
const { updateListBarang } = require('../../helper/ListBarang');
const { updateListDokumen } = require('../../helper/ListDokumen');
const { updateDataPetiKemas } = require('../../helper/DataPetiKemas');
const { dataBarang } = require('../../helper/bundleDataBarang');
const { dataDokumen } = require('../../helper/bundleDataLanjutan');
const { validationDokumen } = require('../../middlewares/validationDataLanjutan');
const { validationListBarang } = require('../../middlewares/validationDataBarang');
const Http = require('../../helper/Httplib');
const sequelize = require('../../configs/database');
const authentication = require('../../middlewares/authentication');
const { createUserActivity } = require('../../helper/UserActivity');

const updateDataHeader = async (req, res) => {
    let transaction;
    try {
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
        const { reportId, dataPengajuanId, identitasPenerimaId, identitasPengirimId, transaksiPerdaganganId, pengangkutanId, pelabuhanMuatBongkarId,beratDanVolumeId, petiKemasDanPengemasId, tempatPenimbunanId, perkiraanTanggalId } = dataSearchReport;
        
        const dataPengajuanUpdate = await updateDataPengajuan(pengajuan, dataPengajuanId, reportId, false, transaction);
        const identitasPengirimUpdate = await updateReportIdentitasPengirim(identitasPengirim, identitasPengirimId, reportId, false, transaction);
        const identitasPenerimaUpdate = await updateReportIdentitasPenerima(identitasPenerima, identitasPenerimaId, reportId, false, transaction);
        const transaksiPerdaganganUpdate = await updateReportTransaksiPerdagangan(transaksiPerdagangan, transaksiPerdaganganId, reportId, false, transaction);
        
        const dataPengangkutanUpdate = await updateDataPengangkutan(pengangkutan, pengangkutanId, reportId, false, transaction); // Success
        const pelabuhanMuatBongkarUpdate = await updateDataPelabuhanMuatBongkar(pelabuhanMuatBongkar, pelabuhanMuatBongkarId, reportId, false, transaction); 
        const beratDanVolumeUpdate = await updateDataBeratDanVolume(beratDanVolume, beratDanVolumeId, reportId ,false, transaction);
        const petiKemasDanPengemasUpdate = await updateDataPetiKemasDanPengemas(petiKemasDanPengemas, petiKemasDanPengemasId, reportId, false, transaction);
        const tempatPenimbunanUpdate = await updateDataTempatPenimbunan(tempatPenimbunan, tempatPenimbunanId, reportId, false, transaction);
        const perkiraanTanggalPengeluaranUpdate = await updatePerkiraanTanggalPengeluaran(perkiraanTanggalPengeluaran, perkiraanTanggalId, reportId, true, transaction);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, `Updating "Data Header" Report`);
        }

        await transaction.commit();
        return successResponse(res, Http.created, "Success Updating Report", perkiraanTanggalPengeluaranUpdate);
    } catch (error) {
        await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Failed To Edit The Report", error);
    }
}

const updateListDokumenLanjutan = async (req, res) => {
    try {

        const {DataToInput: {listDokumen}} = req;
        const {id} = req.params;
        const listDokumenResult = await updateListDokumen(listDokumen, id, true, null);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, `Updating "List Dokumen" Report`);
        }

        return successResponse(res, Http.created, "Success Updating Document", {idListDokumen: listDokumenResult.id});
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Failed To Update Document");
    }
}

const updateDataLanjutan = async (req, res) => {
    try {
        const {DataToInput: {petiKemas}} = req;
        const {id} = req.params;
        const petiKemasResult = await updateDataPetiKemas(petiKemas, id, false, null);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, `Updating "Data Lanjutan" Report`);
        }

        return successResponse(res, Http.created, "Success Updating Peti Kemas")
    } catch (error) {
        
    }
}

const updateDataBarang = async (req, res) => {
    try {
        const {DataToInput: {listBarang}} = req;

        const dataBarangUpdate = await updateListBarang(listBarang, req.params.id, true, null);

        const dataToReturn = {
            idListBarang: dataBarangUpdate.id,
            reportId: dataBarangUpdate.reportId
        }

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, `Updating "Data Barang" Report`);
        }


        return successResponse(res, Http.created, 'Success Update Item', dataToReturn);
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Failed To Update Item")
    }
}

module.exports = (routes) => {
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

    routes.put('/data-barang/:id',
        authentication,
        validationListBarang,
        validationResponse,
        dataBarang,
        updateDataBarang
    );

    routes.put('/data-lanjutan/:id',
        authentication,
        updateDataLanjutan
    );

    routes.put('/listDokumen/:id',
        authentication,
        validationDokumen,
        validationResponse,
        dataDokumen,
        updateListDokumenLanjutan
    )

}