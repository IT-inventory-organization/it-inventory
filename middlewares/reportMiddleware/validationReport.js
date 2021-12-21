const { body, check } = require('express-validator');

const vReport = [
    body('ref.jenisPemberitahuan').trim().isString().notEmpty().withMessage("Jenis Pemberitahuan Harus Di isi"),
    body('ref.diAjukanDiKantor').trim().isString().notEmpty().withMessage("Pengajuan Kantor Harus Ada"),
    body('ref.jenisDokumenBC').trim().isString().notEmpty().withMessage("Jenis Dokumen BC Harus Di isi"),
];

module.exports = {
    vReport  
}