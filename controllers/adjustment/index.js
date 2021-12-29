const { validationResult, check } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const path = require('path');
const fs = require('fs');
const sequelize = require('../../configs/database');
const DataBarang = require('../../database/models/data_barang');
const AdjustmentBarang = require('../../database/models/adjustment_barang');
const authentication = require('../../middlewares/authentication');
const multer = require('multer');
const { BadRequest } = require('../../middlewares/errHandler');
const diskStorate = multer.diskStorage({
    destination: "publics/uploads",
    filename: function(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
})
const limitSize = 2 * 1024 * 1024; // 2Mb

const list = async(req, res) => {
    try {
        let query = {};
        const dataBarangId = parseInt(req.query.dataBarangId);
        if (Number.isInteger(dataBarangId)) {
            query.dataBarangId = dataBarangId;
        }
        const adjustments = await AdjustmentBarang.findAll({
            where: query,
            // include: { model: DataBarang },
            // exclude: []
        });

        return successResponse(res, Http.ok, "Success", adjustments, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const onCreateValidation = [
    check('body.*.dataBarangId')
        .notEmpty().withMessage('ID barang kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    check('bpdy.*.namaBarang')
        .notEmpty().withMessage('Nama barang kosong')
        .trim(),
    check('body.*.nomorAdjustment')
        .notEmpty().withMessage('Nomor adjustment kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    check('body.*.tanggalAdjustment')
        .notEmpty().withMessage('Tanggal adjustment kosong')
        .isDate().withMessage('Format tanggal salah'),
    check('body.*.quantity')
        .notEmpty().withMessage('Quantity kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    check('body.*.remarks')
        .trim(),
];

const create = async(req, res) => {
    let transaction;
    const mimeType = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'application/msword'
    ];

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.badRequest, "Validation error", errors.array());
        }
        if(!req.file){
            throw new BadRequest('Input File Persetujuan Terdahulu', '', req);
        }
        if(!mimeType.includes(req.file.mimetype)){
            throw new BadRequest("Extension File Salah", '', req);
        }
        
        const {body, file} = req;
        
        transaction = await sequelize.transaction();
        const adjustmentItem = {
            namaBarang: body.namaBarang,
            nomorAdjustment: body.nomorAdjustment,
            tanggalAdjustment: body.tanggalAdjustment,
            quantity: body.quantity,
            remarks: body.remarks,
            dataBarangId: body.dataBarangId,
            approval: file.filename
        }

        const adjustment = await AdjustmentBarang.create(adjustmentItem, { transaction });
        // const barang = await DataBarang.update({
        //     stock: sequelize.literal(`stock + ${body.quantity}`)
        // }, {
        //     where: {
        //         id: body.dataBarangId
        //     }
        // });

        if (transaction) await transaction.commit();
        return successResponse(res, Http.ok, "Success", 'asd', false);
    } catch (error) {
        const {file} = req;
        
        fs.unlinkSync(file.path)

        if (transaction) await transaction.rollback();
        if(!error.status){
            return errorResponse(res, Http.internalServerError, "Something went wrong");    
        }
        return errorResponse(res, error.status, error.message);
    }
}

module.exports = routes => {
    routes.get('/', authentication, list);
    routes.post('/create', authentication, onCreateValidation, multer({
        storage: diskStorate, 
        limits: {
            fileSize: limitSize,
            files: 1
        }
    }).single('approval'), create);
}