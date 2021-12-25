const { body } = require("express-validator");

const validationId = [
    body('data.idReport').trim().notEmpty().withMessage("Terjadi Kesalahan Pada Report"),
]

module.exports = {
    validationId
}