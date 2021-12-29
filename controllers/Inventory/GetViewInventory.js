const { errorResponse, successResponse } = require('../../helper/Response');
const authentication = require('../../middlewares/authentication');

const { getAllInventory } = require('../../helper/Repository/Inventory');
const httpStatus = require('../../helper/Httplib');
const sequelize = require('../../configs/database');

const getViewInventory = async (req, res) => {
    try {
        const idUser = req.currentUser;

        const inventory = await getAllInventory(req, idUser);

        return successResponse(res, httpStatus.ok, "", inventory, false);
    } catch (error) {
        return errorResponse(res, httpStatus.internalServerError, "Gagal Mengambil Data", []);
    }
}

module.exports = routes => {
    routes.get('/', authentication ,getViewInventory)
}