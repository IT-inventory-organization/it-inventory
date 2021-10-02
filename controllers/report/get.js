const { errorResponse, successResponse } = require('../../helper/Response');
const { getAllReport, getOneReport } = require('../../helper/DataReport');
const authentication = require('../../middlewares/Authentication');
const httpStatus = require('../../helper/Httplib');
const { createUserActivity } = require('../../helper/UserActivity');

const getCountReportByType = async (req, res) => {
    try {
        const {type} = req.query;

        const result = await countReportByType(type, req);

        try {
            const temp = result.toJSON(result)
            const resultActivity = await createUserActivity(req.currentUser, null, "View Total Report By Type")
        } catch (error) {
            
        } finally {

        }

        return successResponse(res, httpStatus.ok, "", {result, activity});

    } catch (error) {
        return errorResponse(res, httpStatus.badRequest, "Failed To Get Report Data")
    }
}

const getAll = async(req, res) => {
    try {
        const {pageSize, pageNo, sortBy} = req.query
        const result = await getAllReport(req, pageSize, pageNo, sortBy)
        if(result.error) {
            throw new Error(result.error)
        }
        if(req.currentRole !== "Owner") {
            try {
                const resultActivity = await createUserActivity(req.currentUser, reportId = null, "Viewing Data Report")
            } catch (error) {
                
            } finally {
    
            }
        }
        return successResponse(res, httpStatus.badRequest, "", result)
    } catch (err) {
        return errorResponse(res, httpStatus.internalServerError, err.message)
    }
}

const getOne = async (req, res) => {
    const {id} = req.params
    const result = await getOneReport(req, id)
}

module.exports = (routes) => {
    routes.get('/', authentication, getAll)
    routes.get('/total', authentication, getCountReportByType);
    routes.get('/:id', authentication, getOne)
}
