const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { createDataPO, dataPO} = require('../../helper/bundleDataPO');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');
const { saveDataBarangPO } = require('../../helper/Repository/dataBarangPO');

const validationBarangPO = [
    body('lists.dataBarangPO.*.kodeBarang').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Kode Barang"),
    body('lists.dataBarangPO.*.itemDeskripsi').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Item Deskripsi"),
    body('lists.dataBarangPO.*.qunatity').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Quntity"),
    body('lists.dataBarangPO.*.hargaSatuan').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Harga Satuam"),
    body('lists.dataBarangPO.*.jumlah').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Jumlah"),
]

const bundle = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.dataBarangPO);

        if(Decrypt.listDataBarangPO.length == 0){
            return errorResponse(res, Http.badRequest, "Item Kosong");
        }

        for (const iterator of Decrypt.listDataBarangPO) {
            iterator['reportId'] = Decrypt.reportId;
        }

        req.body.lists = {
            dataBarangPO: Decrypt.listDataBarangPO,
            reportId: Decrypt.reportId
        }
 
        next();    
    } catch (error) {
        throw errorResponse(res, Http.badRequest, 'Gagal Menyimpan Data Barang');
    }
}

/**
 * Save New List DataBarangPO
 * @async
 * @method
 * @param {Request} Req Request From User 
 * @param {Response} Res Response To User
 * @throws {InternalServerError} -- Error On server 
 */
const createListDataBarangPO = async(req, res) => {
    let trans;
    try {
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            const value = validation.array()[0].param.match(/([\d]]+)/g);
            return errorResponse(res, Http.badRequest, `${validation.array()[0].msg} Item No ${+value + 1}`);
        }
        // return;
        trans = await sequelize.transaction();
        
        const {lists} = req.body;

        const resultDataBarangPO = [];
      
        await saveDataBarangPO(lists.dataPO, trans);
    
        await trans.commit();

        return successResponse(res, Http.created, "Berhasil Membuat Data Barang PO", resultDataBarangPO, true);
    } catch (error) {
        if(trans){
            await trans.rollback()
        }
        return errorResponse(res, +error.status, error.message)
    }
    
}

module.exports = routes => {
    routes.post('/createDataBarangPO', validationBarangPO, bundle, createListDataBarangPO); // Get Al
}