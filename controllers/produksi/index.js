const { body, validationResult, matchedData } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { createHashText, checkHashText } = require('../../helper/bcrypt');
const DataBarang = require('../../database/models/data_barang');
const ProduksiBarang = require('../../database/models/produksi_barang');
const ProduksiBarangDetail = require('../../database/models/produksi_barang_detail');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');
const { x64 } = require('crypto-js');
const { addAbortSignal } = require('nodemailer/lib/xoauth2');
const httpStatus = require('../../helper/Httplib');
// const STATUS = require("../Status.const");
// const approval = require("../../database/models/approval");
const { deleteApproval } = require('../../helper/Repository/bcf3315');
const { deleteProduksi } = require('../../helper/Repository/bcf3315');
const produksiBarang = require('../../database/models/produksi_barang');
const { getAllInventory } = require('../../helper/Repository/Inventory');
const produksiBarangDetail = require('../../database/models/produksi_barang_detail');
const dataKapal = require('../../database/models/data_kapal')

const list = async(req, res) => {
    try {
        const produksi = await ProduksiBarang.findAll({ include: { model: ProduksiBarangDetail, as: 'details' } });

        return successResponse(res, Http.ok, "Success", produksi, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}


const getOne = async(req, res) => {
    try {
        let id = req.params.id;
        let dataProduksi = await dataKapal.findOne({
            include: [
                {
                    where: {
                        id: id,
                        isDelelete: false,
                        attributes: ['voyageKapal', 'namaKapal'],
                        include: {
                            model: produksiBarangDetail, as: 'details'
                        }
                    }
                }
            ]
            // where: {
            //     id: id,
            //     isDelete: false,
            //     attributes: ['voyageKapal', 'namaKapal', ],
            //     include: {
            //         model: produksiBarangDetail, as: 'details'
            //     }
            // }
        })
        return successResponse(res, Http.ok, 'Success', dataProduksi, false)
    }catch(error){
        console.error(error);
        return errorResponse(res, Http.internalServerError, 'terjadi kesalahan server')
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
        const updateHasil = await DataBarang.update({
            stock: sequelize.literal(`stock + ${produksi.quantity}`)
        }, {
            where: {
                id: produksi.dataBarangId
            }
        });

        if (Array.isArray(produksi.details)) {
            produksi.details.forEach(async function(detail) {
                const updateBarangBaku = await DataBarang.update({
                    stock: sequelize.literal(`stock - ${detail.quantity}`)
                }, {
                    where: {
                        id: detail.dataBarangId
                    }
                });
            });
        }

        if (transaction) await transaction.commit();
        return successResponse(res, Http.ok, "Success", produksi, false);
    } catch (error) {
        console.error(error);
        if (transaction) await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const destroy = async (req, res) => {
    try {
        let id = req.params.id;
        const statusDataPerId = await ProduksiBarang.findOne({
            where: {
                id: id
            }
        })
        const result = statusDataPerId.toJSON();
        await deleteProduksi(req, id)
        return successResponse(res, httpStatus.ok, 'data berhasil di hapus', result, false)
    }catch(error){
        console.log(error);
        return errorResponse(res, httpStatus.internalServerError, 'gagal menghapus data, terjadi kesalahan pada server')
    }
}

const update = async (req, res) => {
    try{
        let id = req.params.id;
        const body = matchedData(req);

        const updateDataPerId = await produksiBarang.findOne({
            where: {
                id: id,
                isDelelete: false
            }
        })

        const result = updateDataPerId.toJSON();
        await ProduksiBarang.update(body, {
            where: {
                id: id,
                isDelelete: false
            }
        });
        return successResponse(res, httpStatus.ok, 'update berhasil', result, false)
    }catch(error){
        return errorResponse(res, httpStatus.internalServerError, 'terjadi kesalahan server')
    }
}


module.exports = routes => {
    routes.get('/:id', authentication, list),
    routes.post('/create', authentication, onCreateValidation, create),
    routes.delete('/:id/delete', authentication, destroy),
    routes.put('/update/:id', authentication, update),
    routes.get('/getOne/:id', authentication, getOne)
}

// const destroy = async(req, res) => {
//     try {
//         const produksi = await ProduksiBarang.findByPk(req.params.id);
//         if (produksi) produksi.destroy();
 
//         return successResponse(res, Http.ok, "Success", null, false);
//     } catch (error) {
//         console.error(error);
//         return errorResponse(res, Http.internalServerError, "Something went wrong");
//     }
// }