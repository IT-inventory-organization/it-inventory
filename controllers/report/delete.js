const { errorResponse, successResponse } = require("../../helper/Response");
const { deleteReport } = require('../../helper/DataReport');
const { createUserActivity }= require('../../helper/UserActivity');
const Http = require('../../helper/Httplib');
const authentication = require("../../middlewares/Authentication");

const deleteReportDoc = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteReport(id, req);
        
        if(req.currentRole !== 'Owner'){
            await createUserActivity(req.currentUser, null, `Deleting Report Document`);
        }

        return successResponse(res, Http.ok, "Success Deleting Report Document");
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Failed To Delete Report Document");
    }
}

module.exports = (routes) => {
    routes.delete('/:id', authentication, deleteReportDoc);
}