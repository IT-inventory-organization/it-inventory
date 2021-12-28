const { body } = require("express-validator");
const bcf3315 = require("../../database/models/bcf3315");

const onApproveValidation = [
    body('idBCF')
        .notEmpty().withMessage('ID barang kosong')
        .custom(value => {
            return bcf3315.findOne({ where: { id: value } })
               .then((d) => {
                    if (!d) return Promise.reject('BCF 3315 tidak ditemukan');
                });
         })
        .trim(),
    body('nomor')
        .notEmpty().withMessage('Nomor kosong')
        .trim(),
];

const onReviseValidation = [
    body('idBCF')
        .notEmpty().withMessage('ID barang kosong')
        .custom(value => {
            return bcf3315.findOne({ where: { id: value } })
               .then((d) => {
                    if (!d) return Promise.reject('BCF 3315 tidak ditemukan');
                });
         })
        .trim(),
    body('alasan')
        .optional()
        .trim(),
];

module.exports = {onApproveValidation, onReviseValidation}