const { body } = require("express-validator");
const Invoice = require("../database/models/invoice");
const ReceivePayment = require("../database/models/receivePayment");
const { dateFormat } = require("../helper/checkDateFormat");

const VReceivePayment = [
  body("DataToInput.noReceive")
    .trim()
    .notEmpty()
    .withMessage(`"No Invoice" is Required`)
    .custom((value, { req }) => {
      if (req.method == "PUT") {
        return Promise.resolve();
      }

      return ReceivePayment.findOne({
        where: { noReceive: value, isDelete: false },
      }).then((d) => {
        if (d) {
          return Promise.reject(`No Invoice ${value} is Already Taken`);
        }
      });
    }),
  body("DataToInput.idInv")
    .trim()
    .notEmpty()
    .withMessage(`Please Choose A Invoide`),
  body("DataToInput.tanggal")
    .trim()
    .notEmpty()
    .withMessage(`"Tanggal " Is Required`)
    .custom(dateFormat),
  body("DataToInput.idContact")
    .trim()
    .notEmpty()
    .withMessage(`Customer Field is Empty`),
  body("DataToInput.metodePembayaran")
    .trim()
    .notEmpty()
    .withMessage(`Payment Method Is Required`),
  // body("DataToInput.noReferensi")
  //   .optional()
  //   .trim()
  //   .notEmpty()
  //   .withMessage(`Payment Method Is Required`),
  body("DataToInput.remarks")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`Remarks Is Required`),
  body("DataToInput.ReceivePaymentDetail.deskripsi")
    .trim()
    .notEmpty()
    .withMessage(`Description is Empty`),
  body("DataToInput.ReceivePaymentDetail.jumlah")
    .trim()
    .notEmpty()
    .withMessage(`"Jumlah" is Empty`),
  // body("DataToInput.ReceivePaymentDetail.jumlahTotal")
  //   .trim()
  //   .notEmpty()
  //   .withMessage(`"Jumlah Total" is Empty`),
  body("DataToInput.ReceivePaymentDetail.totalPenerimaan")
    .trim()
    .notEmpty()
    .withMessage(`"Total Penerimaan" is Empty`),
];

module.exports = {
  VReceivePayment,
};
