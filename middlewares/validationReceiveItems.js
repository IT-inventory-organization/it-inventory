const { body } = require("express-validator");
const ReceiveItems = require("../database/models/receivedItems");
const { dateFormat } = require("../helper/checkDateFormat");
const VReceive = [
  body("DataToInput.idPo")
    .trim()
    .notEmpty()
    .withMessage(`"No Purchase Order" Is Not Selected`),
  body("DataToInput.noReceive")
    .trim()
    .notEmpty()
    .withMessage(`No Receive Is Required`)
    .custom((value, { req }) => {
      if (req.method === "PUT") {
        return Promise.resolve();
      }

      return ReceiveItems.findOne({
        where: { noReceive: value, isDelete: false },
      }).then((d) => {
        if (d) {
          return Promise.reject(`No Receive Is Already Existed`);
        }
      });
    }),
  body("DataToInput.tanggal")
    .trim()
    .notEmpty()
    .withMessage(`"Tanggal" Is Required`)
    .custom(dateFormat),
  body("DataToInput.remarks")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`"Jenis Masuk" Is Required`),
  body("DataToInput.ReceivedItemsQty.*.idBarangPo")
    .trim()
    .notEmpty()
    .withMessage(`Items Not Exist In Purchase Order`),
  body("DataToInput.ReceivedItemsQty.*.quantityReceived")
    .notEmpty()
    .withMessage(`Quantity Received Is Required`)
    .trim(),
];

module.exports = VReceive;
