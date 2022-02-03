const { body } = require("express-validator");
const Invoice = require("../database/models/invoice");
const { dateFormat } = require("../helper/checkDateFormat");

const VInvoice = [
  body("DataToInput.noInvoice")
    .trim()
    .notEmpty()
    .withMessage(`"No Invoice" is Required`)
    .custom((value, { req }) => {
      if (req.method == "PUT") {
        return Promise.resolve();
      }

      return Invoice.findOne({
        where: { noInvoice: value, isDelete: false },
      }).then((d) => {
        if (d) {
          return Promise.reject(`No Invoice ${value} is Already Taken`);
        }
      });
    }),
  body("DataToInput.idDo")
    .trim()
    .notEmpty()
    .withMessage(`Please Choose A Delivery Order`),
  body("DataToInput.tanggalInvoice")
    .trim()
    .notEmpty()
    .withMessage(`"Tanggal Invoice" Is Required`)
    .custom(dateFormat),
  body("DataToInput.jangkaWaktuString")
    .trim()
    .notEmpty()
    .withMessage(`Please Select A Period Of Time`),
  body("DataToInput.jatuhTempo")
    .trim()
    .notEmpty()
    .withMessage(`"Jatuh Tempo" Is Required`),
  body("DataToInput.remarks")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`Remarks Is Required`),
  body("DataToInput.noRef")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`"No Ref" Is Required`),
  body("DataToInput.InvoiceDetail.*.idDOBarang")
    .trim()
    .notEmpty()
    .withMessage(`Item Didn't Exists`),
];

module.exports = {
  VInvoice,
};
