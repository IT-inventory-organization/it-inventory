const { errorResponse, successResponse } = require('../../helper/Response');
const authentication = require('../../middlewares/authentication');

const { deletePurchaseOrderPerId } = require('../../helper/Repository/dataPO');
const httpStatus = require('../../helper/Httplib');

/**
 * 
 * @param {Request} Req Request From User
 * @param {Response} Res Response To User
 * @throws {InternalServerError} 
 */
const deletePurchaseOrder = async(req, res) => {
    try {
        const idUser = req.currentUser;
        const {id} = req.params;
        
        const result = await deletePurchaseOrderPerId(req, idUser, id);
        
        return successResponse(res, httpStatus.ok, "", result, true);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, error);
    } 
}

module.exports = routes => {
    routes.delete('/:id', authentication ,deletePurchaseOrder)
}