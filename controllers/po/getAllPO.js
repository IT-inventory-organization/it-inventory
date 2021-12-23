
const { errorResponse, successResponse } = require('../../helper/Response');
const authentication = require('../../middlewares/authentication');

const { getAllPurchaseOrder } = require('../../helper/Repository/dataPO');
const httpStatus = require('../../helper/Httplib');
const { convertDate } = require('../../helper/convert');

const getAllPO = async(req, res) => {
    try {
        const idUser = req.currentUser;

        const result = await getAllPurchaseOrder(req, idUser);
        
        const fetchData = [];
        for (const iterator of result.rows) {
            const tempData = iterator.toJSON();
            tempData.tanggalPurchaseOrder = convertDate(iterator.tanggalPurchaseOrder);
            fetchData.push(tempData);
        }

        return successResponse(res, httpStatus.ok, "", result, true);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, error);
    } 
}


module.exports = routes => {
    routes.get('/', authentication, getAllPO); // Get Al
}