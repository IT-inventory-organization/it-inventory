const httpStatus = require("../../helper/Httplib")
const { getTempatPenimbunanAllThatTrueRepo } = require("../../helper/Repository/tempatPenimbunan")
const { successResponse, errorResponse } = require("../../helper/Response");
const authentication = require("../../middlewares/authentication");

const getTempatPenimbunan = async(req, res) => {
    try {
        const result = await getTempatPenimbunanAllThatTrueRepo(req);
   
        return successResponse(res, httpStatus.ok, "", result, false);
    } catch (error) {
        if(!error){
            return errorResponse(res, httpStatus.internalServerError, "AWSD")
        }
        return errorResponse(res, httpStatus.internalServerError, "AWSD");
    }
}

module.exports = routes => {
    routes.get('/', authentication, getTempatPenimbunan)
}