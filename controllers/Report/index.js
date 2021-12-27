const { errorResponse, successResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');
const { validationResponse } = require('../../middlewares/validationResponse');
const authentication = require('../../middlewares/authentication');
const { formatReport } = require('../../middlewares/reportMiddleware/reformatReport');
const { saveReport, getReportPerId, dashboard, deleteReport } = require('../../helper/Repository/report');
const { saveAktifitas } = require('../../helper/saveAktifitas');
const { authorizationReport } = require('../../helper/authorization');
const { convertDate } = require('../../helper/convert');
const httpStatus = require('../../helper/Httplib');
const { vReport } = require('../../middlewares/reportMiddleware/validationReport');
const { getOneDocumentPemasukanForCheck } = require('../../helper/Repository/dokumenPemasukan');
const { NotFoundException, Forbidden } = require('../../middlewares/errHandler');

const tambahReport = async (req, res) => {
    try {
        const {ref} = req.body;

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
        }, true);
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

        return errorResponse(res, error.status, error.message);
    }
}

const getDashboard = async(req, res) => {
    try {
        const report = await dashboard(req);

        if(req.currentRole !== "Owner"){
            saveAktifitas({userId: req.currentUser, reportId: req.params.idReport, aktifitas: `Melihat Report ${req.params.idReport}`})
        }
        return successResponse(res, Http.ok, "", report)
    } catch (error) {

        return errorResponse(res, error.status, error.message);
    }
} 

const deleteReportWithUserAccess = async(req, res) => {
    try {
        const {id} = req.params;
        const fetch = await getOneDocumentPemasukanForCheck(req, id);
        if(!fetch){
            throw new NotFoundException("Data Pemasukan Tidak Ada", '', req);
        }
        const data = fetch.toJSON();
        
        if(data.dokumenPengeluaran && data.dokumenPemasukan){
            throw new Forbidden("Tidak Bisa Di Hapus", '', req);
        }

        await deleteReport(req, id, req.currentUser);

        return successResponse(res, httpStatus.ok, "Berhasil Di Hapus", "", true);
    } catch (error) {
        if(!error.status){
            return errorResponse(res, httpStatus.internalServerError, "Terjadi Kesalahan Pada Server")    
        }
        return errorResponse(res, error.status, error.message)
    }
}

const deleteReportUser = async(req, res) => {
    try {
        const {id} = req.params;
        await deleteReport(req, id, req.currentUser);
        if(req.currentRole !== "Owner"){
            saveAktifitas({userId: req.currentUser, reportId: req.params.id, aktifitas: `Menghapus Report ${req.params.idReport}`})
        }
        return successResponse(res, httpStatus.ok, "Berhasil Menghapus", "", false);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, "Gagal Menghapus Report", "")
    }
}

module.exports = routes => {
    routes.post('/save', authentication, formatReport, vReport, validationResponse, tambahReport);
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
    routes.delete('/delete/:id', authentication, deleteReportWithUserAccess);
}