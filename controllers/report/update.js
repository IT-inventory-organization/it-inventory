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
const { createListBarang, fullDelete, fetchListBarang } = require('../../helper/ListBarang');
const { softDeleteListDokumen, createListDokumen } = require('../../helper/ListDokumen');
const { updateDataPetiKemas } = require('../../helper/DataPetiKemas');
const { BDataBarang } = require('../../helper/bundleDataBarang');
const { dataDokumen,petiKemas } = require('../../helper/bundleDataLanjutan');
const { validationArrListDokumen,validationPetiKemas } = require('../../middlewares/validationDataLanjutan');
const { VListBarang } = require('../../middlewares/validationDataBarang');
const Http = require('../../helper/Httplib');
const sequelize = require('../../configs/database');
const authentication = require('../../middlewares/authentication');
const { createUserActivity } = require('../../helper/UserActivity');
const { updateReport, updateStatus, checkAuthorization, getOneSpecificReport, getOneReport } = require('../../helper/DataReport');
const validationReport = require('../../middlewares/validationDataReport');
const { bundleReport } = require('../../helper/bundleReport');
const { updateDataLartas } = require('../../helper/DataLartas');
const { updateStockItem, getListItem } = require('../../helper/Barang');
const { reverseJenisPemberiahuan } = require('../../helper/util');
const { insertHistory } = require('../../helper/Histories');

const updateDataHeader = async (req, res) => {
    let transaction;
    try {
        const {id} = req.params;
        transaction = await sequelize.transaction();

        const { DataToInput: {dataPengajuan, identitasPengirim, identitasPenerima, transaksiPerdagangan, dataPengangkutan, dataPelabuhanMuatBongkar, dataBeratDanVolume, dataPetiKemasDanPengemas, dataLartas, dataTempatPenimbunan, dataPerkiraanTanggalPengeluaran, dataSearchReport}} = req.body;
    
        await checkAuthorization(req, id, transaction)

        // const { dataPengajuanId, identitasPenerimaId, identitasPengirimId, transaksiPerdaganganId, pengangkutanId, pelabuhanMuatBongkarId, beratDanVolumeId, petiKemasDanPengemasId, dataLartasId, tempatPenimbunanId, perkiraanTanggalId } = dataSearchReport; 
        
        // return;
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
        console.log(error)
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
        console.error(error);
        await transaction.rollback();
        return errorResponse(res, Http.internalServerError, error.message);
    }
}

const updateDataBarang = async (req, res) => {
    let transaction;
    const {idReport} = req.params;
    
    try {

        const {DataToInput: {listDataBarang}} = req.body;
        
        /**
         * Mencari List Barang Dengan Id Report Pada Param
         */
        let oldlistBarang = await fetchListBarang(req, idReport); // Fetch Data Di List Barang
        
        /**
         * Jika Tidak Di Temukan Buat Array Kosong
         */
        if(!oldlistBarang){
            oldlistBarang = [];
        }

        /**
         * Mencari Satu Report Dengan id Report
         */
        const found = await getOneSpecificReport(req, idReport); // Mencari Jenis Pemberitahuan Report

        if(!found){ // JIka Tidak Di Temukan Beri Pesan Error Gagal
            return errorResponse(res, Http.internalServerError, "Failed To Update Data");
        }

        /**
         * Mengambil Key Jenis Pemberitahuan Pada Report
         */
        const jenisPemberitahuan = found.toJSON().jenisPemberitahuan;
        
        /**
         * Loop List Barang Pada @variable idList 
         */
        for (let i = 0; i < oldlistBarang.length; i++) {
            const element = oldlistBarang[i];
            const res = element.toJSON();

            /**
             * Mengembalikan Ke Nilai Awal, Dengan Mengambil Jenis Pemberitahuan Report, 
             * Dan Memberinya Kebalikan dari Dari Jenis Pemberitahuan
             * e.x:
             *  Jenis Pemberitahuan Import --> Maka Kebalikannya Export. vica versa. 
             */
            await sequelize.transaction(async t => {
                return await updateStockItem(req, res.idBarang, null, res.quantity, reverseJenisPemberiahuan(jenisPemberitahuan), t);
            })
            
        }

        transaction = await sequelize.transaction();

        let resultsListBarang = [];

        /**
         * Membuat List Barang Baru Dengan Quantity Yang Berbeda
         */
        for(let i = 0; i < listDataBarang.length; i++) {
            await fullDelete(req, listDataBarang[i].id, idReport, transaction); // Menghapus List Barang Yang lama
            if(listDataBarang[i].id){
                delete listDataBarang[i].id // Membuang Id
            }
            /**
             * Membuat List Barang Baru Dengan Quantity Yang Berbeda
             */
            resultsListBarang.push(await createListBarang(listDataBarang[i], transaction));
            
            /**
             * Update Stock Barang Tanpa Menukarkan Jenis Pemberitahuan
             */
            await updateStockItem(req, listDataBarang[i].idBarang, null, listDataBarang[i].quantity, jenisPemberitahuan, transaction);
        }

        const dataToReturn = {
            listDataBarang: resultsListBarang.map(el => el.id),
            reportId: resultsListBarang[0].id
        }

        await createUserActivity(req.currentUser, idReport, `Updating "Data Barang" Report`);
        

        await transaction.commit();
        return successResponse(res, Http.created, 'Success Update Item', dataToReturn);
    } catch (error) {
        // console.log(error)
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, Http.internalServerError, error.message);
    }
}

const checkStatus = (val, status) => {
    let stats = ``;
    
    switch (true) {
        case /(hijau)/.test(status):
            if(/(export)/gi.test(val)){
                stats = `decrease`;
            }else if(/(import)/gi.test(val)){
                stats = `increase`;
            }
            break;
        case /(merah)/.test(status):
            break;
        default:
            break;
    }
    return stats;
}

const updateStatusInvetory = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    let transaction;
    try {
        if(req.currentRole !== 'Admin'){
            throw new Error(`${req.currentRole} Cannot Updating Status`);
        }

        transaction = await sequelize.transaction();

        const result = await getOneReport(req, id);

        if((/(merah)/).test(status)){
            const { listBarangs, jenisPemberitahuan } = result;
            
            for(let i = 0; i < listBarangs.length; i++){
                const {quantity, idBarang} = listBarangs[i].toJSON();
                
                // Mengembalikan Nilai
                await updateStockItem(req, idBarang, null, quantity, reverseJenisPemberiahuan(jenisPemberitahuan), transaction);
            }
        }else if((/(hijau)/gi).test(status)){
            const {listBarangs, jenisPemberitahuan} = result;

            for(let i = 0; i < listBarangs.length; i++){
                const {idBarang, quantity} = listBarangs[i].toJSON();

                const data = {
                    idBarang: idBarang,
                    reportId: id,
                    quantityItem: quantity,
                    status: checkStatus(jenisPemberitahuan, status)
                }

                // Menyimpan Catatan
                await insertHistory(data, transaction)
            }
        }

        // console.log(result)

        await updateStatus(id, status, transaction);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, id, `Updating Status Report`);
        }
        await transaction.commit();
        return successResponse(res, Http.created, "Success Updating Status");
    } catch (error) {
        await transaction.rollback();
        return errorResponse(res, Http.internalServerError, error.message);
    }
}

const updateReportPerId = async (req, res) => {
    const { id } = req.params;
    try {
        
        const result = await updateReport(id, req.body.DataToInput, req);

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
        idReport,
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
        BDataBarang,
        VListBarang,
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