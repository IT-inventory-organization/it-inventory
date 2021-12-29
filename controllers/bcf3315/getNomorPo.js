const { errorResponse, successResponse } = require('../../helper/Response');

const authentication = require('../../middlewares/authentication');

const httpStatus = require('../../helper/Httplib');
const { getAllPurchaseOrderForBCF3315, getBarangForBCF3315AfterChoosingNumberPurchaseOrder } = require('../../helper/Repository/dataPO');

const getNomorPurchaseOrderBasedUserInfo = async (req, res) => {
    try {
        const isUser = req.currentUser;

        const result = await getAllPurchaseOrderForBCF3315(res, isUser, true);
    
        return successResponse(res, httpStatus.ok, "", result.flat(), true);
    } catch (error) {
        console.log(error);
        return errorResponse(res, error.status, "Gagal Mengambil Kapal Penjual");
    }
}

const getBarangPurchaseOrderBasedNomorPurchaseOrderThatBeenChoosed = async (req, res) => {
    try {
        const {id} = req.params;
        
        const result = await getBarangForBCF3315AfterChoosingNumberPurchaseOrder(req, req.currentUser, id);

        return successResponse(res, httpStatus.ok, "", result, true);
    } catch (error) {
        return errorResponse(res, error.status, error.message, "");
    }
}

module.exports = routes => {
    routes.get('/list', authentication, getNomorPurchaseOrderBasedUserInfo);
    routes.get('/items/:id', authentication, getBarangPurchaseOrderBasedNomorPurchaseOrderThatBeenChoosed);
}