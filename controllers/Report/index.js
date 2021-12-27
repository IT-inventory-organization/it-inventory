const { errorResponse, successResponse } = require('../../helper/Response')
const Http = require('../../helper/Httplib');
const { validationResponse } = require('../../middlewares/validationResponse');
const authentication = require('../../middlewares/authentication');
const { formatReport } = require('../../middlewares/reportMiddleware/reformatReport');
const { saveReport, getReportPerId, dashboard, deleteReport, getReportForUpdate, updateReportPLB } = require('../../helper/Repository/report');
const { saveAktifitas } = require('../../helper/saveAktifitas');
const { authorizationReport } = require('../../helper/authorization');
const { convertDate } = require('../../helper/convert');
const httpStatus = require('../../helper/Httplib');
const { vReport } = require('../../middlewares/reportMiddleware/validationReport');
const { getOneDocumentPemasukanForCheck } = require('../../helper/Repository/dokumenPemasukan');
const { NotFoundException, Forbidden } = require('../../middlewares/errHandler');
const e = require('express');

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

const _convertDate = (report, tipe = 'pemasukan') => {
    for (const iterator in report) {
        if(!report[iterator]){
            return
        }
    }
    if(tipe == 'pemasukan'){
        report.dokumenPemasukan.tanggalDokumenPemasukan = convertDate(report.dokumenPemasukan.tanggalDokumenPemasukan);
        report.tempatPenimbunan.perkiraanTanggalPengeluaran = convertDate(report.tempatPenimbunan.perkiraanTanggalPengeluaran);
    }else if(tipe == 'pengeluaran'){
        report.dokumenPengeluaran.tanggalDokumen = convertDate(report.dokumenPengeluaran.tanggalDokumen);
    }
    report.dokumenTambahan.tanggalBC10 = convertDate(report.dokumenTambahan.tanggalBC10);
    report.dokumenTambahan.tanggalBC11 = convertDate(report.dokumenTambahan.tanggalBC11);
    report.dokumenTambahan.tanggalBL = convertDate(report.dokumenTambahan.tanggalBL);
    report.dataKapal.tanggalKedatangan = convertDate(report.dataKapal.tanggalKedatangan);
    report.dataKapal.tanggalKeberangkatan = convertDate(report.dataKapal.tanggalKeberangkatan);
    
}

const getReport = async(req, res) => {
    try {
        const {idReport, tipe} = req.params
        const report = await getReportPerId(idReport, tipe, req);
        console.log(report)

        _convertDate(report, tipe)
    
        if(req.currentRole !== "Owner"){
            saveAktifitas({userId: req.currentUser, reportId: req.params.idReport, aktifitas: `Melihat Report ${req.params.idReport}`})
        }

        return successResponse(res, Http.ok, "", report, true)
    } catch (error) {
        console.log(error)
        if(!error.status){
            return errorResponse(res, Http.internalServerError, "Terjadi Kesalahan Pada Server", "");
        }
        return errorResponse(res, error.status, error.message);
    }
}

const GetPerIdReport = async(req, res) => {
    try {
        return successResponse(res, httpStatus.ok, "", await getReportForUpdate(req, req.params.id), false)
    } catch (error) {
        if(!error.status){
            return errorResponse(res, Http.internalServerError, "Terjadi Kesalahan Pada Server", "");
        }
        return errorResponse(res, error.status, error.message);
    }
}

const updateReport = async(req, res) => {
    try {
        const {idReport} = req.params;
        const {id, ...data} = req.body.ref;
        await updateReportPLB(req, idReport, data);

        return successResponse(res, httpStatus.ok, "Berhasil", "", true);
    } catch (error) {
        if(!error.status){
            return errorResponse(res, Http.internalServerError, "Terjadi Kesalahan Pada Server", "");
        }
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
    routes.get('/get/:idReport/:tipe', 
        authentication, 
        authorizationReport,
        getReport,
    );

    routes.get('/getAll/', 
        authentication, 
        getDashboard
    );

    routes.get('/get/:id', authentication, GetPerIdReport);
    routes.put('/update/:idReport', authentication, formatReport, vReport, updateReport);
    routes.delete('/delete/:id', authentication, deleteReportWithUserAccess);
}