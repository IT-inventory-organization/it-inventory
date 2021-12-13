const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const { createDataBarang, dataBarang} = require('../../helper/bundleDataBarang');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');
const { saveDataBarang } = require('../../helper/Repository/dataBarang');
const { create } = require('nconf');
const { internalServerError } = require('../../helper/Httplib');

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
        console.log(req.body, "BODY")
        const Decrypt = Crypt.AESDecrypt(req.body.dataBarang);

        if(Decrypt.listDataBarang.length == 0){
            return errorResponse(res, Http.badRequest, "Item Kosong");
        }
        for (let i = 0; i < Decrypt.listDataBarang.length; i++) {
            Decrypt.listDataBarang[i].reportId = Decrypt.reportId;
        }
        req.body.lists = {
            dataBarang: Decrypt.listDataBarang,
            reportId: Decrypt.reportId
        }
 
        next();    
    } catch (error) {
        console.log(error)
        throw errorResponse(res, Http.badRequest, 'Gagal Menyimpan Data Barang');
    }
}



const createListBarang = async(req, res) => {
    let trans;
    try {
        //(/((\[[0-9]{1,}\]))/g)
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            const value = validation.array()[0].param.match(/([0-9]{1,})/g);
            return errorResponse(res, Http.badRequest, `${validation.array()[0].msg} Item No ${+value + 1}`);
        }
        // return;
        trans = await sequelize.transaction();
        
        const {lists} = req.body;

        const resultBarang = [];
        for (let i = 0; i < lists.dataBarang.length; i++) {
            const result = await saveDataBarang(lists.dataBarang[i], trans);   
            resultBarang.push(result);
        }
        
        await trans.commit();

        return successResponse(res, Http.created, "Berhasil Membuat Barang", resultBarang);
    } catch (error) {
        console.log(error)
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
        let resulsListBarang = [];

        await fullDelete(req, null, idReport, transaction)

        for(let i = 0; i < listDataBarang.length; i++) {
            if(listDataBarang[i].id || typeof listDataBarang[i].id !== 'undefined'){
                delete listDataBarang[i].id
            }

            let result = await createListBarang(listDataBarang[i].id, transaction, idReport);
            if(result.error){
                return errorResponse(res, Http.badRequest, result.error);
            }
            resultsListBarang.push(result);
        }

        const dataReturn = {
            listDataBarang: resulsListBarang.map(el => el.id),
            reportId: resultsListBarang[0].id
        }

        await createUserActivity(req.currentUser, idReport, `Updating "Data Barang" Report`);

        await transaction.commit();
        return successResponse(res, Http.created, `Update Success`, dataToReturn);
    } catch (error) {
        console.log(error)
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