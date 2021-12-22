const { errorResponse, successResponse } = require('../../helper/Response');

const authentication = require('../../middlewares/authentication');
const { getKapalPenjual } = require('../../helper/Repository/report');
const httpStatus = require('../../helper/Httplib');
const { fetchBarangAfterChoosingKapalPenjual } = require('../../helper/Repository/dataBarang');

const getListKapalPenjualThatBelongToUser = async (req, res) => {
    try {
        const isUser = req.currentUser;

        const result = await getKapalPenjual(res, isUser);
        
        return successResponse(res, httpStatus.ok, "", result, true);
    } catch (error) {
        return errorResponse(res, error.status, error.message);
    }
}

const getBarangFromKapalPenjual = async (req, res) => {
    try {
        const {id} = req.params;
        const idUser = req.currentUser;

        const result = await fetchBarangAfterChoosingKapalPenjual(req, id, idUser);

        return successResponse(res, httpStatus.ok, "", result, true);
    } catch (error) {
        // console.log(error)
        return errorResponse(res, error.status, error.message, "");
    }
}

module.exports = routes => {
    routes.get('/list', authentication, getListKapalPenjualThatBelongToUser);
    routes.get('/items/:id', authentication, getBarangFromKapalPenjual);
}