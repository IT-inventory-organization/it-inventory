const { errorResponse, successResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');

const { validationResponse } = require('../../middlewares/validationResponse');
const authentication = require('../../middlewares/authentication');
const { formatReport } = require('../../middlewares/reportMiddleware/reformatReport');
const { saveReport, getReportPerId, dashboard } = require('../../helper/Repository/report');
const { saveAktifitas } = require('../../helper/saveAktifitas');
const { authorizationReport } = require('../../helper/authorization');
const { convertDate } = require('../../helper/convert');

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

const _convertDate = (report) => {
    report.dokumenPemasukan.tanggalDokumenPemasukan = convertDate(report.dokumenPemasukan.tanggalDokumenPemasukan);
    report.dokumenTambahan.tanggalBC10 = convertDate(report.dokumenTambahan.tanggalBC10);
    report.dokumenTambahan.tanggalBC11 = convertDate(report.dokumenTambahan.tanggalBC11);
    report.dokumenTambahan.tanggalBL = convertDate(report.dokumenTambahan.tanggalBL);
    report.dataKapal.tanggalKedatangan = convertDate(report.dataKapal.tanggalKedatangan);
    report.dataKapal.tanggalKeberangkatan = convertDate(report.dataKapal.tanggalKeberangkatan);
    report.tempatPenimbunan.perkiraanTanggalPengeluaran = convertDate(report.tempatPenimbunan.perkiraanTanggalPengeluaran);
}

const getReport = async(req, res) => {
    try {
        const report = await getReportPerId(req.params.idReport);
        
        _convertDate(report)
    
        if(req.currentRole !== "Owner"){
            saveAktifitas({userId: req.currentUser, reportId: req.params.idReport, aktifitas: `Melihat Report ${req.params.idReport}`})
        }

        return successResponse(res, Http.ok, "", report)
    } catch (error) {
        // console.log(error)
        return errorResponse(res, error.status, error.message);
    }
}

const getDashboard = async(req, res) => {
    try {
        const report = await dashboard(req);

        // _convertDate(report)
        console.log(report)

        if(req.currentRole !== "Owner"){
            saveAktifitas({userId: req.currentUser, reportId: req.params.idReport, aktifitas: `Melihat Report ${req.params.idReport}`})
        }
        return successResponse(res, Http.ok, "", report)
    } catch (error) {
        console.log(error)
        return errorResponse(res, error.status, error.message);
    }
} 

module.exports = routes => {
    routes.post('/save', authentication, formatReport, validationResponse, tambahReport);
    routes.get('/get/:idReport', 
        authentication, 
        authorizationReport,
        getReport,
    );

    routes.get('/getAll/', 
        authentication, 
        // authorizationReport,
        // getReport,
        getDashboard
    );
}