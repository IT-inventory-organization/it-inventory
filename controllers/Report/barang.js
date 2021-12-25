const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');
const { saveDataBarang, updateDataBarangRepo } = require('../../helper/Repository/dataBarang');
const DataBarang = require('../../database/models/data_barang');
const { isExist } = require('../../helper/checkExistingDataFromTable');
const { saveAktifitas } = require('../../helper/saveAktifitas');
const { saveAktifitasUser } = require('../../helper/Repository/aktifitasUser');

const validationBarang = [
    body('lists.dataBarang.*.kodeBarang').trim().notEmpty().withMessage("Kolom Kode Barang Terjadi Kesalahan"),
    body('lists.dataBarang.*.namaBarang').trim().notEmpty().withMessage("Kolom Nama Barang Terjasdi Kesalahan"),
    body('lists.dataBarang.*.satuanKemasan').trim().notEmpty().withMessage("Kolom Satuan Kemasan Terjadi Kesalahan"),
    body('lists.dataBarang.*.stock').trim().notEmpty().withMessage("Kolom Stock Kosong"),
    body('lists.dataBarang.*.posTarif').trim().notEmpty().withMessage(`Kolom Pos Tarif Terjadi Kesalahan`),
    body('lists.dataBarang.*.uraian').trim().notEmpty().withMessage(`Kolom Uraian Terjadi Kesalahan`),
    body('lists.dataBarang.*.nettoBruttoVolume').trim().notEmpty().withMessage(`Kolom Netto, Bruto, Volume Terjadi Kesalahan`),
    body('lists.dataBarang.*.nilaiPabeanHargaPenyerahan').trim().notEmpty().withMessage('Kolom Nilai Pabean Dan Harga Penyerahan Kosong'),
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
        delete req.body.dataBarang;
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
            const value = validation.array()[0].param.match(/([\d]+)/g);
            return errorResponse(res, Http.badRequest, `${validation.array()[0].msg} Item No ${+value + 1}`);
        }
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
        if(!error.status){
            return errorResponse(res, Http.internalServerError, "Terjadi Kesalahan Pada Server")
        }
        return errorResponse(res, error.status, error.message)
    }
    
}

/**
 * Incomplete Function End Point
 */
const updateDataBarang = async (req, res) => {

    let transaction;

    try {
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            const value = validation.array()[0].param.match(/([\d]+)/g);
            return errorResponse(res, Http.badRequest, `${validation.array()[0].msg} Item No ${+value + 1}`);
        }

        const {lists: {dataBarang, reportId}} = req.body;

        await isExist(DataBarang, {
            where: {
                reportId: reportId
            }
        });

        transaction = await sequelize.transaction();
        const resulsListBarang = [];

        for (const iterator of dataBarang) {
            
            const {id, ...dataUpdate} = iterator;
            
            let result = await updateDataBarangRepo(req, dataUpdate, id, reportId, transaction);
            resulsListBarang.push(result);
        }

        const data = {
            user: req.currentUser,
            reportId: reportId,
            aktifitas: 'Update Data Barang'
        }
        await saveAktifitasUser(data, transaction, req);

        const dataReturn = {
            listDataBarang: resulsListBarang.map(el => el.id),
            reportId: reportId
        }

        await transaction.commit();
        return successResponse(res, Http.created, `Update Success`, dataReturn);
    } catch (error) {
        if(transaction) {
            await transaction.rollback();
        }
        return errorResponse(res, error.status, error.message)
    }
};


module.exports = routes => {
    routes.post('/save', authentication, bundle, validationBarang, createListBarang); // Get Al
    routes.put('/updateDataBarang', authentication, bundle, validationBarang, updateDataBarang)
}