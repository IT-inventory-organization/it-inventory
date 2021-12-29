const { errorResponse, successResponse } = require('../../helper/Response');
const authentication = require('../../middlewares/authentication');

const { getAllInventory } = require('../../helper/Repository/Inventory');
const httpStatus = require('../../helper/Httplib');

const getViewInventory = async (req, res) => {
    try {
        
        const inventory = await getAllInventory(req, req.currentUser);
        
        for (const key in inventory) {
            if (Object.hasOwnProperty.call(inventory, key)) {
                const element = inventory[key].toJSON();
                if(element?.dokumenPemasukan?.dokumenPengeluaran){
                    delete inventory[key];
                }
            }
        }

        return successResponse(res, httpStatus.ok, "", inventory.flat(), false);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, "Gagal Mengambil Data", []);
    }
}

// const { body, validationResult, matchedData } = require('express-validator');
// const dataBarang = require('../../database/models/data_barang');
// const produksiBarang = require('../../database/models/produksi_barang');
// const produksiBarangDetail = require('../../database/models/produksi_barang_detail');


// const onCreateValidation = [
//     body('nomorProduksi')
//         .notEmpty().withMessage('Nomor produksi kosong')
//         .custom(value => {
//             return ProduksiBarang.findOne({ where: { nomorProduksi: value } })
//                .then((d) => {
//                     if (d) return Promise.reject('Nomor produksi duplikat');
//                 });
//          })
//         .trim(),
//     body('dataBarangId')
//         .notEmpty().withMessage('ID barang kosong')
//         .isNumeric().withMessage('Isi dengan angka')
//         .trim(),
//     body('quantity')
//         .notEmpty().withMessage('Quantity kosong')
//         .isNumeric().withMessage('Isi dengan angka')
//         .trim(),
//     body('tanggalProduksi')
//         .notEmpty().withMessage('Tanggal adjustment kosong')
//         .isDate().withMessage('Format tanggal salah'),
//     body('remarks')
//         .trim(),
//     body('details.*.dataBarangId')
//         .notEmpty().withMessage('ID barang kosong')
//         .isNumeric().withMessage('Isi dengan angka')
//         .trim(),
//     body('details.*.kodeBarang')
//         .notEmpty().withMessage('Kode barang kosong')
//         .trim(),
//     body('details.*.deskripsi')
//         .trim(),
//     body('details.*.quantity')
//         .notEmpty().withMessage('Quantity kosong')
//         .isNumeric().withMessage('Isi dengan angka')
//         .trim(),
//     body('details.*.jumlah')
//         .notEmpty().withMessage('Jumlah kosong')
//         .isNumeric().withMessage('Isi dengan angka')
//         .trim(),
// ];

// const create = async(req, res) => {
//     let transaction;
//     try {
//         const error = validationResult(req);
//         if(!errorResponse.isEmpty()){
//             return errorResponse(res, Http.internalServerError, 'validation error', errors. array());
//         }
//         const body = matchedData(req);
//         transaction = await sequelize.transaction();
//         const produksi = await produksiBarang.create(body, {
//             transaction, include: ['details']
//         });
//         const updateHasil = await dataBarang.update({
//             stock: sequelize.literal(`stock + ${produksi.quantity}`)
//         }, {
//             where: {
//                 id: produksi.dataBarangId
//             }
//         })
//         if (Array.isArray(produksi.details)){
//             produksi.details.forEach(async function(detail){
//                 const updateBarangBaku = await dataBarang.update({
//                     stock: sequelize.literal(`stock - ${detail.quantity}`)
//                 }, {
//                     where: {
//                         id: detail.dataBarangId
//                     }
//                 })
//             })
//         }
//         if (transaction) await transaction.commit();
//         return successResponse(res, Http.ok, 'Success', produksi, false)
//     } catch (error) {
//         if (transaction) await transaction.rollback();
//         return errorResponse(res, Http.internalServerError, "Something went wrong");
//     }
// }

module.exports = routes => {
    routes.get('/', authentication ,getViewInventory)
    // routes.post('/create', authentication, onCreateValidation, create )
}