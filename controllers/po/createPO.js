const {body, validationResult, check} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');
const { saveDataPO, checkPurchaseOrderExistance } = require('../../helper/Repository/dataPO');
const { saveDataBarangPO } = require('../../helper/Repository/dataBarangPO');
const { validationResponse } = require('../../middlewares/validationResponse');
const { convertForInputDateOnly } = require('../../helper/convert');
const { checkFormat } = require('../../helper/checkDateFormat');
const httpStatus = require('../../helper/Httplib');
const { BadRequest } = require('../../middlewares/errHandler');


const validationPO = [
    body('lists.dataPO.PurchaseOrder.kapalPenjual').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Kapal Penjual"),
    body('lists.dataPO.PurchaseOrder.nomorPO').trim().notEmpty().withMessage('Terjadi Kesalahan Pada Kolom Nomor Po '),
    body('lists.dataPO.PurchaseOrder.tanggalPurchaseOrder').trim().custom(checkFormat),
    body('lists.dataPO.PurchaseOrder.reportId').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Report Id"),
    body('lists.dataPO.PurchaseOrder.jumlahTotal').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Kolom Jumlah Total"),
    body('lists.dataPO.PurchaseOrder.remarks').trim().notEmpty().withMessage(`Terjadi Kesalahan Pada Kolom Remarks`)
]

const validationBarangPO = [
    body('lists.dataPO.ListPurchaseOrderItem.*.idBarang').trim().isNumeric().notEmpty().withMessage("Terjadi Kesalahan"),
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
        }
        
        next();     
    } catch (error) {
        throw errorResponse(res, Http.badRequest, 'Gagal Menyimpan Data PO');
    }
}

/**
 * Save Purchase Order
 * @async
 * @method
 * @param {Request} req 
 * @param {Response} res
 * @throws {InternalServerError} 
 */
const createListPO = async(req, res) => {
    let trans;
    try {
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            const value = validation.array()[0].param.match(/([\d]+)/g);
            return errorResponse(res, Http.badRequest, `${validation.array()[0].msg} Item No ${+value + 1}`);
        }
        delete req.body.dataPO;
        const {lists} = req.body;
        const PurchaseOrder = await checkPurchaseOrderExistance(`PO-${lists.dataPO.PurchaseOrder.nomorPO}`);
        if(PurchaseOrder){
            throw new BadRequest('Nomor Purchase Order Duplikat', null, req);
        }
        trans = await sequelize.transaction();
        
        lists.dataPO.PurchaseOrder.nomorPO = `PO-${lists.dataPO.PurchaseOrder.nomorPO}`;
        lists.dataPO.PurchaseOrder.userId = req.currentUser;
        
        const result = await saveDataPO(lists.dataPO.PurchaseOrder, trans);

        const json = result.toJSON();

        for (const iterator of lists.dataPO.ListPurchaseOrderItem) {
            iterator.poId = json.id;

            await saveDataBarangPO(iterator, trans);
        }

        await trans.commit();

        return successResponse(res, Http.created, "Berhasil Membuat PO", '', true);
    } catch (error) {
        console.log(error)
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
        createListPO
    ); 
}