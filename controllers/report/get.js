const { errorResponse, successResponse } = require('../../helper/Response');
const { getAllReport, getOneReport } = require('../../helper/DataReport');
const authentication = require('../../middlewares/Authentication');
const httpStatus = require('../../helper/Httplib');
const { createUserActivity } = require('../../helper/UserActivity');
const { countReportByType } = require('../../helper/DataReport');

const getCountReportByType = async (req, res) => {
    try {
        const {status} = req.query;

        const result = await countReportByType(status, req);

        try {
            // const temp = result.toJSON(result)
            const resultActivity = await createUserActivity(req.currentUser, null, "View Total Report By Type")
        } catch (error) {
            throw error;
        } finally {

        }

        const total = result[0]; 
        if(total.length == 0){
            return successResponse(res, httpStatus.ok, `Data With Status "${status}" Is Empty`);
        }

        let returnValue = {};
        // Separate Import And Export 
        for (let i = 0; i < total.length; i++) {
            const element = total[i];
            returnValue[element.jenisPemberitahuan] = element.count;
        }
        returnValue["status"] = status; 

        return successResponse(res, httpStatus.ok, "", returnValue);
    } catch (error) {
        return errorResponse(res, httpStatus.badRequest, "Failed To Get Report Data")
    }
}

const getAll = async(req, res) => {
    try {
        const {pageSize, pageNo, sortBy, searchQuery} = req.query
        const result = await getAllReport(req, pageSize, pageNo, sortBy, searchQuery)
        if(result.error) {
            throw new Error(result.error)
        }
        if(req.currentRole !== "Owner") {
            try {
                await createUserActivity(req.currentUser, reportId = null, "Viewing Data Report")
            } catch (error) {
                
            } finally {
    
            }
        }
        return successResponse(res, httpStatus.ok, "", result);
    } catch (err) {
        return errorResponse(res, httpStatus.internalServerError, "Failed View Data Report");
    }
}

const getOne = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await getOneReport(req, id);

        if(req.currentRole != 'Owner'){
            await createUserActivity(req.currentUser, id, "View One Report");
        }

        return successResponse(res, httpStatus.ok, "", result);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, "Failed To Get Report");
    }
}

module.exports = (routes) => {
    routes.get('/', authentication, getAll)
    routes.get('/total', authentication, getCountReportByType);
    routes.get('/:id', authentication, getOne)
}
