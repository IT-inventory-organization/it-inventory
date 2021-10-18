const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const { createListItem, softDeleteListItem, updateListItem, getListItem, updateStockItem, getItem, fetchHistoryIteBarang } = require('../../helper/Barang');
const Crypt = require('../../helper/encription');
const { createUserActivity } = require('../../helper/UserActivity');
const { getOneHistoryOnItem } = require('../../helper/Barang');
const { getHistoryBarangPerItem } = require('../../helper/Histories');
const { key } = require('nconf');

const validationItem = [
    body('dataItem.name').trim().notEmpty().withMessage(`Name is Not Provided`),
    body('dataItem.posTarif').trim().notEmpty().withMessage(`"Pos Tarif Is Required`),
    body('dataItem.hsCode').trim().notEmpty().withMessage(`HS Code is Required`),
    body('dataItem.uraian').trim().notEmpty().withMessage(`"Uraian" is Required`),
    body('dataItem.nettoBrutoVolume').trim().notEmpty().withMessage(`"Netto, Bruto, Volume" Is Required`),
    body('dataItem.satuanKemasan').trim().notEmpty().withMessage(`"Satuan Kemasan" Is Required`),
    // body('dataItem.nilaiPabeanHargaPenyerahan').trim().notEmpty().withMessage(`" Nilai Pabean, Nilai Penyerahan" Is Required`),
    body('dataItem.stock').trim().notEmpty().withMessage(`Quantity is Required`),
]

const bundle = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.item);
        // console.log(Decrypt);return;
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
        

        await createListItem(dataItem);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, 'Create New List Item');
        }

        return successResponse(res, Http.created, "Success Create List Item");

    } catch (error) {
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
        return errorResponse(res, Http.badRequest, error.message)
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
        delete dataItem.id;
        await updateListItem(req, id, dataItem);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, 'Update Item Barang')
        }

        return successResponse(res, Http.ok, "Success Update Item Barang")
    } catch (error) {
        console.log(error)
        return errorResponse(res, Http.badRequest, "Failed To Edit Item")
    }
}

const getAnItem = async(req, res) => {
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
        console.log(error)
        return errorResponse(res, Http.internalServerError, "Failed Fetch Item")        
    }
}

const updateStock = async(req, res) => {
    try {
        const { total } = Crypt.AESDecrypt(req.body.Total);
        
        if(typeof total === 'undefined' || total == null){
            return errorResponse(res, Http.badRequest, "Number Value is Empty")
        }

        const {id} = req.params;
        const {status} = req.query;

        const resultStockItem = await updateStockItem(req, id, status, total);
        
        return successResponse(res, Http.created, "", resultStockItem)
    } catch (error) {
        return errorResponse(res, Http.internalServerError, error.message)
    }
}

const getItemToChoose = async (req, res) => {
    try {
        const data = await getItem(req);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, "Fetch Item To Choose An Item in Data Barang");
        }

        return successResponse(res, Http.ok, "", data.toJSON());
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Failed To Fetch Data")
    }
}

const historyDataBarang = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await getHistoryBarangPerItem(req, id);
        const name = await getListItem(req, {id: id})
        let qry = [];
        for(let i =0; i < result.length; i++){
            let obj = {};
            // console.log(name)
            obj['name'] = name[0].name;
            const keys = Object.keys(result[i]);
            for(let j = 0; j < keys.length; j++){
                const seperate = keys[j].split('.');
                
                obj[seperate[seperate.length - 1]] = result[i][`${seperate.join('.')}`]; 
            }

            qry.push(obj)
            delete obj;
        }

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, `Looking Through Item History`);
        }
        
        return successResponse(res, Http.ok, "Success Fetching Item History", qry);
    } catch (error) {

        return errorResponse(res, Http.internalServerError, error)
    }
}


module.exports = routes => {
    routes.get('/', authentication, getAnItem); // Get All
    routes.get('/:id', authentication, getAnItem); // Get One
    routes.post('/save', authentication, bundle, validationItem, createItemBarang);
    routes.put('/update/:id', authentication, bundle, validationItem, editItemBarang);
    routes.delete('/delete/:id', authentication, validationItem, deleteItemBarang);
    routes.put('/update-stock/:id', authentication, updateStock);
    routes.get('/history/:id', authentication, historyDataBarang);
}