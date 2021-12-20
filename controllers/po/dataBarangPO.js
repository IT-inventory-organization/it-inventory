const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
// const authentication = require('../../middlewares/authentication');
const { createDataPO, dataPO} = require('../../helper/bundleDataPO');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');
// const { saveDataPO } = require('../../helper/Repository/dataPO');
const { create } = require('nconf');
const { saveDataBarangPO } = require('../../helper/Repository/dataBarangPO');
// const { internalServerError } = require('../../helper/Httplib');

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
        for (let i = 0; i < Decrypt.listDataBarangPO.length; i++) {
            Decrypt.listDataBarangPO[i].reportId = Decrypt.reportId;
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


const createListDataBarangPO = async(req, res) => {
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

        const resultDataBarangPO = [];
      
        const result = await saveDataBarangPO(lists.dataPO, trans);
    
        
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