const { body } = require("express-validator");
const PurchaseOrder = require("../database/models/purchaseOrder");
const { dateFormat } = require("../helper/checkDateFormat");
const VPurchaseOrder = [
  body("DataToInput.nomorPO")
    .trim()
    .notEmpty()
    .withMessage(`"No. Purchase Order" Is Required`)
    .custom((value, { req }) => {
      return PurchaseOrder.findOne({ where: { nomorPO: value } }).then((d) => {
        if (d) {
          return Promise.reject(`No. Purchase Order Already Exists`);
        }
      });
    }),
  body("DataToInput.tanggal")
    .trim()
    .notEmpty()
    .withMessage(`"Tanggal" Is Required`)
    .custom(dateFormat),
  body("DataToInput.supplier")
    .trim()
    .notEmpty()
    .withMessage(`"Supplier" Is Required`),
  body("DataToInput.remarks")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`"Remarks" Is Required`),
  body("DataToInput.total")
    .trim()
    .notEmpty()
    .withMessage(`"Total" Is Required`),
  body("DataToInput.BarangPo.*.idBarang")
    .notEmpty()
    .withMessage(`"Barang" Is Not Selected`)
    .trim(),
  body("DataToInput.BarangPo.*.quantity")
    .notEmpty()
    .withMessage(`Quantity Is Not Selected`)
    .trim(),
  body("DataTOInput.BarangPo.*.hargaSatuan")
    .notEmpty()
    .withMessage(`"harga Satuan" Is Required`)
    .trim(),
  body("DataToInput.BarangPo.*.jumlah")
    .notEmpty()
    .withMessage(`"Jumlah" Is Required`)
    .trim(),
];

module.exports = VPurchaseOrder;
