const { body } = require("express-validator");
const Invoice = require("../database/models/invoice");
const { dateFormat } = require("../helper/checkDateFormat");

const VBillPayment = [
  body("DataToInput.idBill")
    .trim()
    .notEmpty()
    .withMessage(`Please Select A Bill`),
  body("DataToInput.tanggal")
    .trim()
    .notEmpty()
    .withMessage(`"Tanggal" Is Required`)
    .custom(dateFormat),
  body("DataToInput.idContact")
    .trim()
    .notEmpty()
    .withMessage(`"Supplier" Is Required`),
  body("DataToInput.total")
    .trim()
    .notEmpty()
    .withMessage(`"Total" Is Requried`),
  body("DataToInput.remarks")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`Remarks Is Required`),
  body("DataToInput.BillPaymentItems.*.idBillItem")
    .trim()
    .notEmpty()
    .withMessage(`Item Didn't Exists`),
];

module.exports = {
  VBillPayment,
};
