const { body, validationResult, matchedData } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { createHashText, checkHashText } = require('../../helper/bcrypt');
const DataBarang = require('../../database/models/data_barang');
const ProduksiBarang = require('../../database/models/produksi_barang');
const ProduksiBarangDetail = require('../../database/models/produksi_barang_detail');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');

const list = async(req, res) => {
    try {
        const produksi = await ProduksiBarang.findAll({ include: { model: ProduksiBarangDetail, as: 'details' } });

        return successResponse(res, Http.ok, "Success", produksi, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const onCreateValidation = [
    body('nomorProduksi')
        .notEmpty().withMessage('Nomor produksi kosong')
        .custom(value => {
            return ProduksiBarang.findOne({ where: { nomorProduksi: value } })
               .then((d) => {
                    if (d) return Promise.reject('Nomor produksi duplikat');
                });
         })
        .trim(),
    body('dataBarangId')
        .notEmpty().withMessage('ID barang kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    body('quantity')
        .notEmpty().withMessage('Quantity kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    body('tanggalProduksi')
        .notEmpty().withMessage('Tanggal adjustment kosong')
        .isDate().withMessage('Format tanggal salah'),
    body('remarks')
        .trim(),
    body('details.*.dataBarangId')
        .notEmpty().withMessage('ID barang kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    body('details.*.kodeBarang')
        .notEmpty().withMessage('Kode barang kosong')
        .trim(),
    body('details.*.deskripsi')
        .trim(),
    body('details.*.quantity')
        .notEmpty().withMessage('Quantity kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
    body('details.*.jumlah')
        .notEmpty().withMessage('Jumlah kosong')
        .isNumeric().withMessage('Isi dengan angka')
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

        const produksi = await ProduksiBarang.create(body, { transaction, include: ['details'] });

        if (transaction) await transaction.commit();
        return successResponse(res, Http.ok, "Success", produksi, false);
    } catch (error) {
        console.error(error);
        if (transaction) await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const destroy = async(req, res) => {
    try {
        const produksi = await ProduksiBarang.findByPk(req.params.id);
        if (produksi) produksi.destroy();
 
        return successResponse(res, Http.ok, "Success", null, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

module.exports = routes => {
    routes.get('/', authentication, list),
    routes.post('/create', authentication, onCreateValidation, create),
    routes.post('/:id/delete', authentication, destroy)
}