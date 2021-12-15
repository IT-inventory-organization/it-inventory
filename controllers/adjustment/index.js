const { body, validationResult, matchedData } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { createHashText, checkHashText } = require('../../helper/bcrypt');
const DataBarang = require('../../database/models/data_barang');
const AdjustmentBarang = require('../../database/models/adjustment_barang');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');

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
    body('dataBarangId')
        .notEmpty().withMessage('ID barang kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    body('namaBarang')
        .notEmpty().withMessage('Nama barang kosong')
        .trim(),
    body('nomorAdjustment')
        .notEmpty().withMessage('Nomor adjustment kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    body('tanggalAdjustment')
        .notEmpty().withMessage('Tanggal adjustment kosong')
        .isDate().withMessage('Format tanggal salah'),
    body('quantity')
        .notEmpty().withMessage('Quantity kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    body('remarks')
        .trim(),
];

const create = async(req, res) => {
    let transaction;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const body = matchedData(req);

        transaction = await sequelize.transaction();

        const adjustment = await AdjustmentBarang.create(body, { transaction });
        const barang = await DataBarang.update({
            stock: sequelize.literal(`stock + ${body.quantity}`)
        }, {
            where: {
                id: body.dataBarangId
            }
        });

        if (transaction) await transaction.commit();
        return successResponse(res, Http.ok, "Success", adjustment, false);
    } catch (error) {
        console.error(error);
        if (transaction) await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

module.exports = routes => {
    routes.get('/', authentication, list),
    routes.post('/create', authentication, onCreateValidation, create)
}