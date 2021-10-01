const { errorResponse, successResponse } = require('../../helper/Response');
const { getReportByType, getRecentActivities } = require('../../helper/DataReport');
const Http = require('../../helper/Httplib');

const getReport = async (req, res) => {
    try {
        const {type} = req.params;

        // const result = await getReportByType(type);
        const activity = await getRecentActivities(type);

        return successResponse(res, Http.ok, "", activity);

    } catch (error) {
        console.error(error)
        return errorResponse(res, Http.badRequest, "Failed To Get Report Data")
    }
}

module.exports = (routes) => {
    routes.get('/:type', getReport);
}
