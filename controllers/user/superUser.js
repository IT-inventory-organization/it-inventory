const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { errorResponse, SuccesResponse} = require('../../helper/Response');
const http = require('../../helper/Httplib');
const {checkHashText} = require('../../helper/bcrypt');
const infoPengguna = require('../../database/models/info_pengguna')


const list  = async (req, res) => {
    try {
        const pengguna = await infoPengguna.findAll({
            attributes: []
        })
    return successResponse(res, Http.ok, "Success", form3315, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "terjadi kesalahan server");
    }
}