const { body } = require("express-validator");
const SalesOrder = require("../database/models/salesOrder");
const { dateFormat } = require("../helper/checkDateFormat");

const VSalesOrder = [
  body("DataToInput.noSalesOrder")
    .trim()
    .notEmpty()
    .withMessage(`No. Sales Order Is Required`)
    .custom((value, { req }) => {
      if (req.method == "PUT") {
        return Promise.resolve();
      }

      return SalesOrder.findOne({ where: { noSalesOrder: value } }).then(
        (d) => {
          if (d) {
            return Promise.reject(`Sales Order ${value} is Already Been Taken`);
          }
        }
      );
    }),
  body("DataToInput.tanggalOrder")
    .trim()
    .notEmpty()
    .withMessage(`"Tanggal Order" Is Required`)
    .custom(dateFormat),
  body("DataToInput.idContact")
    .trim()
    .notEmpty()
    .withMessage(`Selected One Of the Customer in Customer Field`),
  body("DataToInput.total")
    .trim()
    .notEmpty()
    .withMessage(`"Total" Is Required`),
  body("DataToInput.remarks")
    .trim()
    .notEmpty()
    .withMessage(`"Remarks" Is Required`),
  body("DataToInput.SalesOrderBarang.*.idBarang")
    .trim()
    .notEmpty()
    .withMessage("Choose An Items"),
  body("DataToInput.SalesOrderBarang.*.quantity")
    .trim()
    .notEmpty()
    .withMessage("Insert A Quantity"),
  body("DataToInput.SalesOrderBarang.*.hargaSatuan")
    .trim()
    .notEmpty()
    .withMessage("Insert Unit Price"),
  body("DataToInput.SalesOrderBarang.*.jumlah")
    .trim()
    .notEmpty()
    .withMessage("Total Price is Empty, Please Insert Quantity and Unit Price"),
];

module.exports = VSalesOrder;
