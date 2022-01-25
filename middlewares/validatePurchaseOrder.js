const { body, check } = require("express-validator");

const VPurchasrOrder = [
  body("DataToInput.dataPO.nomorPO")
    .notEmpty()
    .withMessage("No Purchase Order is Empty")
    .trim()
    .custom((value, { req }) => {}),
];

module.exports = {};
