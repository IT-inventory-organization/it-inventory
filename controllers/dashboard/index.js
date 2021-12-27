const { errorResponse, successResponse } = require('../../helper/Response');
const authentication = require('../../middlewares/authentication');

const { getAllDashboard } = require('../../helper/Repository/dashboard2');
const httpStatus = require('../../helper/Httplib');
const sequelize = require('../../configs/database');

const getViewDashboard = async (req, res) => {
    try {
        const id = req.params.id;
        const dashboard = await getAllDashboard(req, id);
        return successResponse(res, httpStatus.ok, '', dashboard, false)
    }catch(error){
        return errorResponse(res, httpStatus.internalServerError, 'terjadi kesalahan saat mengambil data', [])
    }
}

module.exports = routes => {
    routes.get('/', authentication, getViewDashboard)
}