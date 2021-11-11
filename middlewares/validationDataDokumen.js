const { body, check } = require('express-validator');

const vDataPengajuan = [
    body('nomorDokumenPemasukan').trim(),
    body('tanggalDokumenPemasukan').custom()
]

module.exports = {
    
}