const { body, validationResult, matchedData } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { createHashText, checkHashText } = require('../../helper/bcrypt');
const { listPLB, getPLB } = require('../../helper/Repository/plb');
const InfoPengguna = require('../../database/models/info_pengguna');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');

const findUserById = async(id) => {    
    return await InfoPengguna.findOne({
        where: {
            id,
            isActive: true
        },
        attributes:{
            exclude: ['isActive', 'password', 'roleId', 'createdAt', 'updatedAt']
        }
    });
}

const list = async(req, res) => {
    try {
        const { limit, offset } = req.query;
        const authUser = await findUserById(req.currentUser);
        // Todo: Check user role and add query
        const plb = await listPLB(limit, offset);
        return successResponse(res, Http.ok, "Success", plb, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const detail = async(req, res) => {
    try {
        const { id } = req.params;
        const plb = await getPLB(id);
        return successResponse(res, Http.ok, "Success", plb, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

module.exports = routes => {
    routes.get('/', authentication, list),
    routes.get('/:id', authentication, detail)
}