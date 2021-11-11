const { errorResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');

const saveDokumenPemasukan = async(req, res) => {
    try {
        
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Gagal Menyimpan Data Dokumen Pemasukan")
    }
}


module.exports = routes => {
    routes.post('/save/pemasukan', );
}