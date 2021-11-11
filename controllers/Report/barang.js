const {body, validationResult} = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const authentication = require('../../middlewares/authentication');
const { createDataBarang, dataBarang} = require('../../helper/bundleDataBarang');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');

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
            const result = await createListBarang(lists.dataBarang[i], trans);   
            resultBarang.push(result)
        }
        
        await trans.commit();

        return successResponse(res, Http.created, "Success Create List Barang", resultBarang);
    } catch (error) {
        console.log(error)
        if(trans){
            await trans.rollback()
        }
        return errorResponse(res, Http.internalServerError, "Failed To Add Barang")
    }
    
}



module.exports = routes => {
    routes.post('/save', authentication, bundle, validationBarang, createListBarang); // Get All
    // routes.get('/:id', authentication, getAnBarang); // Get One
    // routes.post('/save', authentication, bundle, validationBarang, createBarangBarang);
    // routes.put('/update/:id', authentication, bundle, validationBarang, editBarangBarang);
    // routes.delete('/delete/:id', authentication, validationBarang, deleteBarangBarang);
    // routes.put('/update-stock/:id', authentication, updateStock);
    // routes.get('/history/:id', authentication, historyDataBarang);
}