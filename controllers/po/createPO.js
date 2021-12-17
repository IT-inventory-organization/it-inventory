const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');
const { saveDataPO } = require('../../helper/Repository/dataPO');
const { saveDataBarangPO } = require('../../helper/Repository/dataBarangPO');
const { validationResponse } = require('../../middlewares/validationResponse');
const { convertForInputDateOnly } = require('../../helper/convert');
const { checkFormat } = require('../../helper/checkDateFormat');
const { AESDecrypt } = require('../../helper/encription');
const InvoicePO = require('../../database/models/invoice_po');


const validationPO = [

    body('lists.dataPO.PurchaseOrder.kapalPenjual').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Kapal Penjual"),
    body('lists.dataPO.PurchaseOrder.nomorPO').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Nomor Purchase Order"),
    body('lists.dataPO.PurchaseOrder.tanggalPurchaseOrder').trim().custom(checkFormat),
    body('lists.dataPO.PurchaseOrder.reportId').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Report Id"),
    body('lists.dataPO.PurchaseOrder.jumlahTotal').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Jumlah Total"),
    body('lists.dataPO.PurchaseOrder.remarks').trim().notEmpty().withMessage(`Terjadi Kesalahan Pada Kolom Remarks`)
]

const validationBarangPO = [
    body('lists.dataPO.ListPurchaseOrderItem.*.kodeBarang').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Kode Barang"),
    body('lists.dataPO.ListPurchaseOrderItem.*.itemDeskripsi').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Item Deskripsi"),
    body('lists.dataPO.ListPurchaseOrderItem.*.quantity').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Quantity"),
    body('lists.dataPO.ListPurchaseOrderItem.*.hargaSatuan').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Harga Satuam"),
    body('lists.dataPO.ListPurchaseOrderItem.*.jumlah').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Jumlah"),
]


const bundle = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.dataPO);

        req.body.lists = {
            dataPO: Decrypt,
            // reportId: Decrypt.reportId
        }
        
        next();    
    } catch (error) {

        throw errorResponse(res, Http.badRequest, 'Gagal Menyimpan Data PO');
    }
}

const bundleDataBarangPO = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.dataPO);

        if(Decrypt.ListPurchaseOrderItem.length == 0){
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
        
        lists.dataPO.PurchaseOrder.nomorPO = `PO-${lists.dataPO.PurchaseOrder.nomorPO}`;
        lists.dataPO.PurchaseOrder.tanggalPurchaseOrder = convertForInputDateOnly(lists.dataPO.PurchaseOrder.tanggalPurchaseOrder);
        
        const result = await saveDataPO(lists.dataPO.PurchaseOrder, trans);

        const json = result.toJSON();

        
        for(let i = 0; i < lists.dataPO.ListPurchaseOrderItem.length; i++){
            lists.dataPO.ListPurchaseOrderItem[i].poId = json.id;
            
            await saveDataBarangPO(lists.dataPO.ListPurchaseOrderItem[i], trans);
        }

        await trans.commit();

        return successResponse(res, Http.created, "Berhasil Membuat PO", true);
    } catch (error) {
     
        if(trans){
            await trans.rollback()
        }
        return errorResponse(res, +error.status, error.message)
    }
    
}

module.exports = routes => {
    routes.post('/', 
        authentication, 
        bundle, 
        validationPO,
        validationBarangPO,
        validationResponse,
        createListPO); 
}