const { errorResponse, successResponse } = require("../../helper/Response");
const { deleteListBarang } = require('../../helper/ListBarang');
const { deleteListDokumen } = require('../../helper/ListDokumen');
const { deleteReport } = require('../../helper/DataReport');
const Http = require('../../helper/Httplib');

const deleteDataBarang = async (req, res, next) => {
    try {
        const {id } = req.params;

        await deleteListBarang(id, false, null);

        return successResponse(res, Http.ok, "Success Deleting Item List")
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Failed To Delete Document");
    }
}

const deleteDataDokumen = async (req, res, next) => {
    try {
        const { id } = req.params;

        await deleteListDokumen(id, false, null);

        return successResponse(res, Http.ok, "Success Deleting Document List");
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Delete Document")
    }
}

const deleteReportDoc = async (req, res, next) => {
    try {
        const { id } = req.params;

        await deleteReport(id, null);

        return successResponse(res, Http.ok, "Success Deleting Report Document");
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Delete Report Document")
    }
}

module.exports = (routes) => {
    routes.delete('/data-barang/:id', deleteDataBarang);
    routes.delete('/listDokumen/:id', deleteDataDokumen);
    routes.delete('/:id', deleteReportDoc)
}