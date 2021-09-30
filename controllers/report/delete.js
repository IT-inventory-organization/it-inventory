const { errorResponse, successResponse } = require("../../helper/Response");
const { deleteListBarang } = require('../../helper/ListBarang');
const Http = require('../../helper/Httplib');

const deleteDataBarang = async (req, res, next) => {
    try {
        const {id } = req.params;

        await deleteListBarang(id, false, null);

        return successResponse(res, Http.ok, "Success Deleting Document")
    } catch (error) {
        
        return errorResponse(res, Http.badRequest, "Failed To Delete Document");
    }
}

module.exports = (routes) => {
    routes.delete('/data-barang/:id', deleteDataBarang);
}