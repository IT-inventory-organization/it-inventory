const { errorResponse, successResponse } = require('../../helper/Response');
const authentication = require('../../middlewares/authentication');

const { viewOnePo } = require('../../helper/Repository/dataPO');
const httpStatus = require('../../helper/Httplib');

const getOnePOEachUser = async(req, res) => {
    try {
        const idUser = req.currentUser;
        const {id} = req.params;

        const result = await viewOnePo(req, idUser, id);
        
        return successResponse(res, httpStatus.ok, "", result, true);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, error);
    } 
}

module.exports = routes => {
    routes.get('/:id', authentication ,getOnePOEachUser)
}