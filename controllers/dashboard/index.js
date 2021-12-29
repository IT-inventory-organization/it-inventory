const { body, validationResult, matchedData } = require ('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { listDashboard, getDashboard } = require('../../helper/Repository/dashboard3');
const infoPengguna = require('../../database/models/info_pengguna');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');

const findUserById = async(id) => {
    return infoPengguna.findOne({
        where: {
            id,
            isActive: true
        },
        attributes: {
            exclude: ['isActive', 'password', 'roleId', 'createdAt', 'updatedAt']
        }
    })
}

const list = async(req, res) => {
    try {
        const { limit, offset } = req.query;
        const authUser = await findUserById(req.currentUser);
        const dashboard = await listDashboard(limit, offset);
        return successResponse(res, Http.ok, "Success", dashboard, false);
    } catch (error) {
        console.log(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}
module.exports = routes => {
    routes.get('/', authentication, list);
}