const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');
const { saveDataBarang } = require('../../helper/Repository/dataBarang');
const { internalServerError } = require('../../helper/Httplib');
const Report = require('../../database/models/report');

const validationBarang = [
    body('lists.dataBarang.*.kodeBarang').trim().notEmpty().withMessage("Kolom Kode Barang Terjadi Kesalahan"),
    body('lists.dataBarang.*.namaBarang').trim().notEmpty().withMessage("Kolom Nama Barang Terjasdi Kesalahan"),
    body('lists.dataBarang.*.satuanKemasan').trim().notEmpty().withMessage("Kolom Satuan Kemasan Terjadi Kesalahan"),
    body('lists.dataBarang.*.stock').trim().notEmpty().withMessage("Kolom Stock Kosong"),
    body('lists.dataBarang.*.posTarif').trim().notEmpty().withMessage(`Kolom Pos Tarif Terjadi Kesalahan`),
    body('lists.dataBarang.*.uraian').trim().notEmpty().withMessage(`Kolom Uraian Terjadi Kesalahan`),
    body('lists.dataBarang.*.nettoBruttoVolume').trim().notEmpty().withMessage(`Kolom Netto, Bruto, Volume Terjadi Kesalahan`),
    body('lists.dataBarang.*.bm').trim().notEmpty().withMessage(`Kolom BM Terjadi Kesalahan`),
    body('lists.dataBarang.*.ppn').trim().notEmpty().withMessage('Kolom PPN Terjadi Kesalahan'),
    body('lists.dataBarang.*.ppnbm').trim().notEmpty().withMessage('Kolom PPNBM Terjadi Kesalahan'),
    body('lists.dataBarang.*.cukai').trim().notEmpty().withMessage('Kolom Cukai Terjadi Kesalahan'),
]

const bundle = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.dataBarang);

        if(Decrypt.listDataBarang.length == 0){
            return errorResponse(res, Http.badRequest, "Item Kosong");
        }
        
        for (const iterator of Decrypt.listDataBarang) {
            iterator['reportId'] = Decrypt.reportId
        }

        req.body.lists = {
            dataBarang: Decrypt.listDataBarang,
            reportId: Decrypt.reportId
        }
 
        next();    
    } catch (error) {
        throw errorResponse(res, Http.badRequest, 'Gagal Menyimpan Data Barang');
    }
}



const createListBarang = async(req, res) => {
    let trans;
    try {
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            const value = validation.array()[0].param.match(/([0-9]{1,})/g);
            return errorResponse(res, Http.badRequest, `${validation.array()[0].msg} Item No ${+value + 1}`);
        }
        // return;
        trans = await sequelize.transaction();
        
        const {lists} = req.body;

        const resultBarang = [];

        for (const iterator of lists.dataBarang) {
            const result = await saveDataBarang(iterator, trans);
            resultBarang.push(result)
        }

        await trans.commit();

        return successResponse(res, Http.created, "Berhasil Membuat Barang", resultBarang);
    } catch (error) {

        if(trans){
            await trans.rollback()
        }
        return errorResponse(res, +error.status, error.message)
    }
    
}

const updateDataBarang = async (req, res) => {

    let transaction;
    
    const{idReport} = req.params;

    try {
        const {DataToInput: {listDataBarang}} = req.body;
        await isExist(Report, {where: {id: idReport, userId: req.currentUser}});

        transaction = await sequelize.transaction();
        const resulsListBarang = [];

        await fullDelete(req, null, idReport, transaction)


        for (const iterator of listDataBarang) {
            if(iterator.id || typeof iterator.id !== 'undefined'){
                delete iterator.id
            }

            let result = await saveDataBarang(iterator, transaction);
            if(result.error){
                return errorResponse(res, Http.badRequest, result.error);
            }
            resultsListBarang.push(result);
        }

        const dataReturn = {
            listDataBarang: resulsListBarang.map(el => el.id),
            reportId: resultsListBarang[0].id
        }

        await createUserActivity(req.currentUser, idReport, `Updating "Data Barang" Report`, dataReturn, true);

        await transaction.commit();
        return successResponse(res, Http.created, `Update Success`, dataToReturn);
    } catch (error) {

        if(transaction) {
            await transaction.rollback();
        }
        return errorResponse (res, internalServerError, error.message)
    }
};





module.exports = routes => {
    routes.post('/save', authentication, bundle, validationBarang, createListBarang); // Get Al
    routes.put('/updateDataBarang', authentication, bundle, validationBarang, updateDataBarang)
}