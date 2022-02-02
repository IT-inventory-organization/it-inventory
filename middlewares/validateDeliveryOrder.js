const { body } = require("express-validator");
const DeliveryOrder = require("../database/models/deliveryOrder");
const { dateFormat } = require("../helper/checkDateFormat");

const VDeliveryOrder = [
  body("DataToInput.nomorDO")
    .trim()
    .notEmpty()
    .withMessage(`"Nomor Do" is Required`)
    .custom((value, { req }) => {
      if (req.method == "PUT") {
        return Promise.resolve();
      }

      return DeliveryOrder.findOne({
        where: { nomorDO: value, isDelete: false },
      }).then((d) => {
        if (d) {
          return Promise.reject(`No Delivery Order ${value} is Already Taken`);
        }
      });
    }),
  body("DataToInput.tanggal")
    .trim()
    .notEmpty()
    .withMessage(`"Tanggal " Is Required`)
    .custom(dateFormat),
  body("DataToInput.idSo")
    .trim()
    .notEmpty()
    .withMessage(`Select One Of Sales Order in the Sales Order Field`),
  body("DataToInput.remarks")
    .trim()
    .notEmpty()
    .withMessage(`Remarks Is Required`),
  body("DataToInput.DeliveryOrderBarang.*.quantityReceived")
    .trim()
    .notEmpty()
    .withMessage(`Input Quantity Received`),
  body("DataToInput.DeliveryOrderBarang.*.idSOBarang")
    .trim()
    .notEmpty()
    .withMessage("Item Didn`t Exist"),
];

module.exports = {
  VDeliveryOrder,
};
