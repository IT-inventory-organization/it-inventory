const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const {checkHashText} = require('../../helper/bcrypt');
const infoPengguna = require('../../database/models/info_pengguna');
const authentication = require('../../middlewares/authentication');


const list  = async (req, res) => {
    try {
        const pengguna = await infoPengguna.findAll({
        attributes : ['id', 'username', 'namaPemilik', 'roleEnum', 'isActive'],
        // include    : [{ 
        //     model: bar,
        //     attributes: attributes
        //     }]
        })
    return successResponse(res, Http.ok, "Success", pengguna, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "terjadi kesalahan server");
    }
}



module.exports = routes => {
    routes.get('/list', authentication, list)
}