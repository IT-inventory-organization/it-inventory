
const { errorResponse, successResponse } = require('../../helper/Response');
const authentication = require('../../middlewares/authentication');

const { getAllPurchaseOrder } = require('../../helper/Repository/dataPO');
const httpStatus = require('../../helper/Httplib');

const getAllPO = async(req, res) => {
    try {
        const idUser = req.currentUser;

        const result = await getAllPurchaseOrder(req, idUser);
        
        return successResponse(res, httpStatus.ok, "", result, false);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, error);
    } 
}


module.exports = routes => {
    routes.get('/', authentication, getAllPO); // Get Al
}