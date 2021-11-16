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
    body('lists.dataBarang.*.posTarif').trim().notEmpty().withMessage(`"Pos Tarif Is Required`),
    body('lists.dataBarang.*.uraian').trim().notEmpty().withMessage(`Uraian is Required`),
    body('lists.dataBarang.*.nettoBruttoVolume').trim().notEmpty().withMessage(`"Netto, Bruto, Volume" Is Required`),
    body('lists.dataBarang.*.bm').trim().notEmpty().withMessage(`"BM" Is Required`),
    body('lists.dataBarang.*.ppn').trim().notEmpty().withMessage('PPN required'),
    body('lists.dataBarang.*.ppnbm').trim().notEmpty().withMessage('PPNBM required'),
    body('lists.dataBarang.*.cukai').trim().notEmpty().withMessage('Cukai required'),
]

const bundle = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.dataBarang);

        for (let i = 0; i < Decrypt.listDataBarang.length; i++) {
            Decrypt.listDataBarang[i].reportId = Decrypt.reportId;

        }
        req.body.lists = {
            dataBarang: Decrypt.listDataBarang,
            reportId: Decrypt.reportId
        }


        next();    
    } catch (error) {
        throw errorResponse(res, Http.badRequest, 'Failed To Add Barang');
    }
}



const createListBarang = async(req, res) => {
    let trans;
    try {
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            return errorResponse(res, Http.badRequest, validation.array()[0].msg);
        }

        trans = await sequelize.transaction();
        
        const {lists} = req.body;


        const resultBarang = [];
        for (let i = 0; i < lists.dataBarang.length; i++) {
            const result = await saveDataBarang(lists.dataBarang[i], trans);   
            resultBarang.push(result);
        }
        
        await trans.commit();

        return successResponse(res, Http.created, "Success Create List Barang", resultBarang);
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
    routes.post('/save', authentication, bundle, validationBarang, createListBarang); // Get All
    routes.put('/updateDataBarang', authentication, bundle, validationBarang, updateDataBarang)
}