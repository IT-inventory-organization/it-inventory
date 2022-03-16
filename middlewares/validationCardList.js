const { body } = require("express-validator");
const CardList = require("../database/models/cardList");

const VCardList = [
  body("DataToInput.ID")
    .trim()
    .notEmpty()
    .withMessage(`ID Is Required`)
    .custom((value, { req }) => {
      if (req.method === "POST") {
        return CardList.findOne({
          where: { _ID: value, isDelete: false },
        }).then((d) => {
          if (d) {
            return Promise.reject("ID Is Duplicate");
          }
        });
      }

      return CardList.findOne({ where: { _ID: value, isDelete: false } }).then(
        (d) => {
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
        }
      );
    }),
  body("DataToInput.name").trim().notEmpty().withMessage(`"Nama" Is Required`),
  body("DataToInput.contactType")
    .trim()
    .notEmpty()
    .withMessage(`"Tipe Kontak" Is Required`),
];

module.exports = VCardList;
