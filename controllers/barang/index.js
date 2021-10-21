const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const { createListItem, softDeleteListItem, updateListItem, getListItem, updateStockItem, getItem } = require('../../helper/Barang');
const Crypt = require('../../helper/encription');
const { createUserActivity } = require('../../helper/UserActivity');
const { getHistoryBarangPerItem, insertHistory } = require('../../helper/Histories');
const sequelize = require('../../configs/database');

const validationItem = [
    body('dataItem.name').trim().notEmpty().withMessage(`Name is Not Provided`),
    body('dataItem.posTarif').trim().notEmpty().withMessage(`"Pos Tarif Is Required`),
    body('dataItem.hsCode').trim().notEmpty().withMessage(`HS Code is Required`),
    body('dataItem.uraian').trim().notEmpty().withMessage(`"Uraian" is Required`),
    body('dataItem.nettoBrutoVolume').trim().notEmpty().withMessage(`"Netto, Bruto, Volume" Is Required`),
    body('dataItem.satuanKemasan').trim().notEmpty().withMessage(`"Satuan Kemasan" Is Required`),
    body('dataItem.stock').trim().notEmpty().withMessage(`Quantity is Required`),
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
        
        const result = await createListItem(dataItem);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, 'Create New List Item');
        }

        return successResponse(res, Http.created, "Success Create List Item", result);
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
        const result = await updateListItem(req, id, dataItem);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, 'Update Item Barang')
        }

        return successResponse(res, Http.ok, "Success Update Item Barang", result)
    } catch (error) {
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
        return errorResponse(res, Http.internalServerError, "Failed Fetch Item")        
    }
}

const updateStock = async(req, res) => {
    let transaction;
    try {
        const { total } = Crypt.AESDecrypt(req.body.Total);
        
        if(total == null){
            return errorResponse(res, Http.badRequest, "Number Value is Empty")
        }

        if(total <= 0){
            return errorResponse(res, Http.badRequest, "Number Value Must Bigger Then Zero")
        }

        const {id} = req.params;
        const {status} = req.query;

        transaction = await sequelize.transaction();

        const resultStockItem = await updateStockItem(req, id, status, total, null, transaction);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, null, `Update Stock`);
        }

        await insertHistory({
            idBarang: id,
            quantityItem: total,
            status: status,
            desc: getDesc(status)
        }, transaction);
        
        await transaction.commit()
        return successResponse(res, Http.created, "", resultStockItem)
    } catch (error) {
        if(transaction){
            await transaction.rollback();
        }
        return errorResponse(res, Http.internalServerError, error.message)
    }
}

const getDesc = (val) => {
    if ((/(increase)/).test(val)){
        return 'Penambahan Barang';
    } else if((/(decrease)/).test(val)){
        return 'Pengurangan Barang';
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
        const {type} = req.query;

        let stats = false
        if(type == `noReport`){
            stats = true
        }

        const result = await getHistoryBarangPerItem(req, id, stats);
        if(result.length == 0){
            return errorResponse(res, Http.badRequest, "Data Not Found")
        }
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
        console.log(error)
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