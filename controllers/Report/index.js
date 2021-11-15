const { errorResponse, successResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');

const { validationResponse } = require('../../middlewares/validationResponse');
const authentication = require('../../middlewares/authentication');
const { formatReport } = require('../../middlewares/reportMiddleware/reformatReport');
const { saveReport, getReportPerId } = require('../../helper/Repository/report');
const { saveAktifitas } = require('../../helper/saveAktifitas');
const { authorizationReport } = require('../../helper/authorization');

const tambahReport = async (req, res) => {
    try {
        const {ref} = req.body;
        // console.log('controller trigger',ref);return;
        const resultReport = await saveReport(ref);

        if(!resultReport){
            return errorResponse(res, Http.conflict, "Gagal Membuat Report");
        }

        const result = resultReport.toJSON();

        if(req.currentRole !== 'Owner'){
            saveAktifitas({userId: req.currentUser, reportId: result.id, aktifitas: "Membuat Report Baru"});
        }

        return successResponse(res, Http.created, {
            "id": result.id,
            "jenisPemberitahuan": result.jenisPemberitahuan,
            "diAjukanDiKantor": result.diAjukanDiKantor,
            "jenisDokumenBC": result.jenisDokumenBC
        });
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Gagal Meyimpan Data");
    }
}

const getReport = async(req, res) => {
    try {
        const report = await getReportPerId(req.params.idReport);

        if(req.currentRole !== "Owner"){
            saveAktifitas({userId: req.currentUser, reportId: req.params.idReport, aktifitas: `Melihat Report ${req.params.idReport}`})
        }

        return successResponse(res, Http.ok, "", report)
    } catch (error) {
        return errorResponse(res, error.status, error.message);
    }
}

module.exports = routes => {
    routes.post('/save', authentication, formatReport, validationResponse, tambahReport);
    routes.get('/get/:idReport', 
        authentication, 
        authorizationReport,
        getReport
    );
}