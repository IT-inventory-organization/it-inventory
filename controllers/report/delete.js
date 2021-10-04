const { errorResponse, successResponse } = require("../../helper/Response");
const { deleteListBarang } = require('../../helper/ListBarang');
const { deleteListDokumen } = require('../../helper/ListDokumen');
const { deleteReport } = require('../../helper/DataReport');
const { createUserActivity }= require('../../helper/UserActivity');
const Http = require('../../helper/Httplib');
const authentication = require("../../middlewares/Authentication");

const deleteDataBarang = async (req, res, next) => {
    try {
        const {id } = req.params;

        await deleteListBarang(id, false, null);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, `Deleting "Data Barang" Report`);
        }

        return successResponse(res, Http.ok, "Success Deleting Item List")
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Failed To Delete Document");
    }
}

const deleteDataDokumen = async (req, res, next) => {
    try {
        const { id } = req.params;

        await deleteListDokumen(id, false, null);

        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, `Deleting "List Dokumen" Report`);
        }

        return successResponse(res, Http.ok, "Success Deleting Document List");
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Delete Document")
    }
}

const deleteReportDoc = async (req, res, next) => {
    try {
        const { id } = req.params;

        await deleteReport(id);
        // return;
        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, `Deleting Report Document`);
        }

        return successResponse(res, Http.ok, "Success Deleting Report Document");
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Delete Report Document")
    }
}

module.exports = (routes) => {
    routes.delete('/data-barang/:id', authentication, deleteDataBarang);
    routes.delete('/listDokumen/:id', authentication, deleteDataDokumen);
    routes.delete('/:id', authentication, deleteReportDoc)
}