const { body } = require("express-validator");
const CashReceive = require("../database/models/cashReceive");
const { dateFormat } = require("../helper/checkDateFormat");

const VCashReceive = [
  body("DataToInput.code")
    .trim()
    .notEmpty()
    .withMessage(`"Kode" is Required`)
    .custom((value, { req }) => {
      if (req.method == "PUT") {
        return Promise.resolve();
      }

      return CashReceive.findOne({
        where: { code: value, isDelete: false },
      }).then((d) => {
        if (d) {
          return Promise.reject(`Code ${value} is Already Taken`);
        }
      });
    }),
  body("DataToInput.tanggal")
    .trim()
    .notEmpty()
    .withMessage(`"Tanggal" Is Required`)
    .custom(dateFormat),
  body("DataToInput.deskripsi")
    .trim()
    .notEmpty()
    .withMessage(`Description is Required`),
  body("DataToInput.jumlah")
    .trim()
    .notEmpty()
    .withMessage(`Jumlah is Required`),
  body("DataToInput.remarks")
    .trim()
    .notEmpty()
    .withMessage(`Remarks Is Required`),
];

module.exports = {
  VCashReceive,
};
