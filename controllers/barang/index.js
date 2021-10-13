const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const { createListItem, softDeleteListItem, updateDeleteListItem, getListItem, updateStockItem } = require('../../helper/Barang');
const Crypt = require('../../helper/encription');
const { createUserActivity } = require('../../helper/UserActivity');

const validationItem = [
    body('dataItem.posTarif').trim().notEmpty().withMessage(`"Pos Tarif Is Required`),
    body('dataItem.hsCode').trim().notEmpty().withMessage(`HS Code is Required`),
    body('dataItem.uraian').trim().notEmpty().withMessage(`"Uraian" is Required`),
    body('dataItem.nettoBrutoVolume').trim().notEmpty().withMessage(`"Netto, Bruto, Volume" Is Required`),
    body('dataItem.satuanKemasan').trim().notEmpty().withMessage(`"Satuan Kemasan" Is Required`),
    body('dataItem.nilaiPabeanHargaPenyerahan').trim().notEmpty().withMessage(`" Nilai Pabean, Nilai Penyerahan" Is Required`),
    body('dataItem.quantity').trim().notEmpty().withMessage(`Quantity is Required`),
]

const bundle = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.item);
        
        req.body.dataItem = {
            ...Decrypt,
            userId: req.currentUser
        }

        next();    
    } catch (error) {
        throw errorResponse(res, Http.badRequest, 'Failed To Add List Item');
    }
    
}

const createItemBarang = async(req, res) => {
    try {
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            return errorResponse(res, Http.badRequest, validation.array()[0].msg);
        }
        const {dataItem} = req.body;
        
        console.log(dataItem);

        await createListItem(dataItem);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, 'Create New List Item');
        }

        return successResponse(res, Http.created, "Success Create List Item");

    } catch (error) {
        // console.log(error)
        return errorResponse(res, Http.internalServerError, "Failed To Add Item")
    }
    
}

const deleteItemBarang = async(req, res) => {
    try {
        const {id} = req.params;

        await softDeleteListItem(req, id);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, 'Delete List Item');
        }

        return successResponse(res, Http.ok, "Success Delete List Item");
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Delete Item")
    }
}

const editItemBarang = async(req, res) => {
    try {
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            return errorResponse(res, Http.badRequest, validation.array()[0].msg);
        }

        const {id} = req.params;
        const {dataItem} = req.body;

        await updateDeleteListItem(req, id, dataItem);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, 'Update Item Barang')
        }

        return successResponse(res, Http.ok, "Success Update Item Barang")
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Edit Item")
    }
}

const getItem = async(req, res) => {
    try {
        const {id} = req.params;
        const {pageSize, pageNo, search} = req.query;
        
        const param = {
            id: id,
            search: search,
            pageSize: pageSize,
            pageNo: pageNo,
        }

        const result = await getListItem(req, param);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, `Fetch Item ${id ? 'All' : 'One'} Data`);
        }

        return successResponse(res, Http.ok, "", result);
    } catch (error) {
        console.log(error);
        return errorResponse(res, Http.internalServerError, "Failed Fetch Item")        
    }
}

const updateStock = async(req, res) => {
    try {
        const { total } = Crypt.AESDecrypt(req.body.Total);

        const {id} = req.params;
        const {status} = req.query;

        const resultStockItem = await updateStockItem(req, id, status, total);
        
        return successResponse(res, Http.created, "", resultStockItem)
    } catch (error) {
        console.log(error)
        return errorResponse(res, Http.internalServerError, error.message)
    }
}

module.exports = routes => {
    routes.get('/', authentication, getItem); // Get All
    routes.get('/:id', authentication, getItem); // Get One
    routes.post('/save', authentication, bundle, validationItem, createItemBarang);
    routes.put('/update/:id', authentication, bundle, validationItem, editItemBarang);
    routes.delete('/delete/:id', authentication, validationItem, deleteItemBarang);
    routes.put('/update-stock/:id', authentication, updateStock);
}