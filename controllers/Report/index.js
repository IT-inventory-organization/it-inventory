const { errorResponse, successResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');

const { validationResponse } = require('../../middlewares/validationResponse');
const authentication = require('../../middlewares/authentication');
const { formatReport } = require('../../middlewares/reportMiddleware/reformatReport');
const { saveReport } = require('../../helper/Repository/report');

const tambahReport = async (req, res) => {
    try {
        const {ref} = req.body;
        // console.log('controller trigger',ref);return;
        const resultReport = await saveReport(ref);

        if(!resultReport){
            return errorResponse(res, Http.conflict, "Gagal Membuat Report");
        }

        if(req.currentRole === 'Owner'){}

        return successResponse(res, Http.created, "Berhasil Membuat Report");
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Gagal Meyimpan Data");
    }
}

module.exports = routes => {
    routes.post('/save', authentication, formatReport, validationResponse, tambahReport);
}