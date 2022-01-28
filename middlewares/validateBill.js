const { body } = require("express-validator");
const Bill = require("../database/models/bill");
const VBill = [
  body("DataToInput.idReceive")
    .trim()
    .notEmpty()
    .withMessage(`No Receive is Empty, Please Selected One of it`),
  body("DataToInput.noTransaksi")
    .trim()
    .notEmpty()
    .withMessage(`"No Transaksi" Is Required`)
    .custom((value, { req }) => {
      if (req.method === "PUT") {
        return Promise.resolve();
      }

      return Bill.findOne({ where: { noTransaksi: value } }).then((d) => {
        if (d) {
          return Promise.reject(`No Transaksi Is Duplicate`);
        }
      });
    }),
  body("DataToInput.remarks")
    .trim()
    .notEmpty()
    .withMessage(`Remarks Is Required`),
  body("DataToInput.total")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`Total Is Required`),
  body("DataToInput.BillPriceItem.*.hargaSatuan")
    .trim()
    .notEmpty()
    .withMessage(`"Harga Satuan" Is Required`),
];

module.exports = VBill;
