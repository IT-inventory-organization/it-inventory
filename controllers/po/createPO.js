const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const { createDataPO, dataPO} = require('../../helper/bundleDataPO');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');
const { saveDataPO } = require('../../helper/Repository/dataPO');
const { saveDataBarangPO } = require('../../helper/Repository/dataBarangPO');
const { saveDataInvoicePO} = require('../../helper/Repository/dataInvoicePO');
const { create } = require('nconf');
const {createDataBarangPO} = require('./dataBarangPO'); 
const { validationResponse } = require('../../middlewares/validationResponse');
const { convertStrignToDateUTC } = require('../../helper/convert');
const { checkFormat } = require('../../helper/checkDateFormat');
// const { internalServerError } = require('../../helper/Httplib');

const validationPO = [
    body('lists.dataPO.kapalPemilik').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Kapal Pemilik"),
    body('lists.dataPO.kapalPembeli').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Kapal Pembeli"),
    body('lists.dataPO.tanggalPurchaseOrder').trim().custom(checkFormat),
    body('lists.dataPO.jumlahTotal').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Jumlah Total"),
    body('lists.dataPO.remarks').trim().notEmpty().withMessage(`Terjadi Kesalahan Pada Kolom Remarks`)
]

const validationBarangPO = [
    body('lists.dataBarangPO.*.kodeBarang').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Kode Barang"),
    body('lists.dataBarangPO.*.itemDeskripsi').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Item Deskripsi"),
    body('lists.dataBarangPO.*.qunatity').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Quntity"),
    body('lists.dataBarangPO.*.hargaSatuan').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Harga Satuam"),
    body('lists.dataBarangPO.*.jumlah').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Jumlah"),
]

const bundle = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.dataPO);
        // console.log(convertStrignToDateUTC(Decrypt.po.tanggalPurchaseOrder))
        // Decrypt.po.tanggalPurchaseOrder = convertStrignToDateUTC(Decrypt.po.tanggalPurchaseOrder);
        
        req.body.lists = {
            dataPO: Decrypt.po,
            // reportId: Decrypt.reportId
        }
        console.log(req.body.lists)
        next();    
    } catch (error) {
        console.log(error);
        throw errorResponse(res, Http.badRequest, 'Gagal Menyimpan Data PO');
    }
}

const bundleDataBarangPO = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.dataPO);

        if(Decrypt.listDataBarangPO.length == 0){
            return errorResponse(res, Http.badRequest, "Item Kosong");
        }
        req.body.lists = {
            ...req.body.lists,
            listDataBarangPO: Decrypt.listDataBarangPO,
        }
 
        next();    
    } catch (error) {
        throw errorResponse(res, Http.badRequest, 'Gagal Menyimpan Data Barang');
    }
}


const createListPO = async(req, res) => {
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

        const resultPO = [];
      
        const result = await saveDataPO(lists.dataPO, trans);

        const json = result.toJSON();

        for(let i = 0; i < lists.listDataBarangPO.length; i++){
            lists.listDataBarangPO[i].poId = json.id;
            await saveDataBarangPO(lists.listDataBarangPO[i], trans);
        }

        const data = {
            poId: json.id,
            nomorPO:'asd',
        }

        const generateInvoice = await saveDataInvoicePO(data, trans)

        await trans.commit();

        return successResponse(res, Http.created, "Berhasil Membuat PO", resultPO);
    } catch (error) {
     
        if(trans){
            await trans.rollback()
        }
        return errorResponse(res, +error.status, error.message)
    }
    
}


createInvoice = async (req, res) => {
    let trans;

}



module.exports = routes => {
    routes.post('/createPO', 
        authentication, 
        bundle,
        bundleDataBarangPO, 
        validationPO,
        validationBarangPO,
        validationResponse,
        createListPO); // Get Al
}