const httpStatus = require("../../helper/Httplib")
const { getTempatPenimbunanAllThatTrueRepo } = require("../../helper/Repository/tempatPenimbunan")
const { successResponse, errorResponse } = require("../../helper/Response");
const authentication = require("../../middlewares/authentication");

const getTempatPenimbunan = async(req, res) => {
    try {
        
        return successResponse(res, httpStatus.ok, "", await getTempatPenimbunanAllThatTrueRepo(req), true);
        
    } catch (error) {
        return errorResponse(res, error.status, error.message);
    }
}

module.exports = routes => {
    routes.get('/', authentication, getTempatPenimbunan)
}