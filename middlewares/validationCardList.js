const { body } = require("express-validator");
const CardList = require("../database/models/cardList");
const VCardList = [
  body("DataToInput.ID")
    .trim()
    .notEmpty()
    .withMessage(`ID Is Required`)
    .custom((value, { req }) => {
      if (req.method === "POST") {
        return CardList.findOne({ where: { _ID: value } }).then((d) => {
          if (d) {
            return Promise.reject("ID Is Duplicate");
          }
        });
      }

      return CardList.findOne({ where: { _ID: value } }).then((d) => {
        if (req.method === "PUT" && d.toJSON()._ID === value) {
          return Promise.resolve();
        } else if (req.method === "PUT" && d.toJSON()._ID !== value) {
          if (d.toJSON()._ID === value) {
            return Promise.reject("ID Is Duplicate");
          }
        }

        if (req.method === "POST") {
          if (d) {
            return Promise.reject("ID Is Duplicate");
          }
        }
      });
    }),
  body("DataToInput.name").trim().notEmpty().withMessage(`"Nama" Is Required`),
  body("DataToInput.contact")
    .trim()
    .notEmpty()
    .withMessage(`"Kontak" Is Required`),
  body("DataToInput.email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`"Email" Is Required`),
  body("DataToInput.officePhone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`"Telepon Kantor" Is Required`),
  body("DataToInput.mobilePhone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`"Telepon Ponsel" Is Required`),
  body("DataToInput.address")
    .trim()
    .notEmpty()
    .withMessage(`"Alamat" Is Required`),
  body("DataToInput.city").trim().notEmpty().withMessage(`"Kota" Is Required`),
  body("DataToInput.province")
    .trim()
    .notEmpty()
    .withMessage(`"Provinsi" Is Required`),
  body("DataToInput.postalCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`"Kode Pos" Is Required`),
  body("DataToInput.country")
    .trim()
    .notEmpty()
    .withMessage(`"Negara" Is Required`),
  body("DataToInput.fax")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`Fax Is Required`),
  body("DataToInput.phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`Phone Is Required`),
  body("DataToInput.contactType")
    .trim()
    .notEmpty()
    .withMessage(`"Tipe Kontak" Is Required`),
];

module.exports = VCardList;
