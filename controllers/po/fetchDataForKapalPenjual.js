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
        return errorResponse(res, error.status, "Gagal Mengambil Kapal Penjual");
    }
}

const getBarangFromKapalPenjual = async (req, res) => {
    try {
        const {id} = req.params;

        const result = await fetchBarangAfterChoosingKapalPenjual(req, id);

        return successResponse(res, httpStatus.ok, "", result, true);
    } catch (error) {
        return errorResponse(res, error.status, error.message, "");
    }
}

module.exports = routes => {
    routes.get('/list', authentication, getListKapalPenjualThatBelongToUser);
    routes.get('/items/:id', authentication, getBarangFromKapalPenjual);
}