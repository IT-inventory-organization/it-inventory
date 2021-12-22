const { body, query, validationResult, matchedData } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { createHashText, checkHashText } = require('../../helper/bcrypt');
const { listInventory, listPemasukan, listPengeluaran } = require('../../helper/Repository/laporan');
const InfoPengguna = require('../../database/models/info_pengguna');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');
const { Op } = require("sequelize");
const moment = require("moment");

const findUserById = async(id) => {    
    return InfoPengguna.findOne({
        where: {
            id,
            isActive: true
        },
        attributes:{
            exclude: ['isActive', 'password', 'roleId', 'createdAt', 'updatedAt']
        }
    });
}

const validation = [
    query('startDate')
        .notEmpty().withMessage('Start Date is required')
        .isDate().withMessage('Is not a valid date'),
    query('endDate')
        .notEmpty().withMessage('End Date is required')
        .isDate().withMessage('Is not a valid date'),
];

const inventory = async(req, res) => {
    try {
        const { limit, offset } = req.query;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const body = matchedData(req);
        const query = {
            createdAt: {
                [Op.between]: [moment(body.startDate), moment(body.endDate).endOf('day')]
            }
        };
        const authUser = await findUserById(req.currentUser);
        // Todo: Check user role and add query
        const inventory = await listInventory(limit, offset, query);
        return successResponse(res, Http.ok, "Success", inventory, false);
    } catch (error) {
        console.log(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const pemasukan = async(req, res) => {
    try {
        const { limit, offset } = req.query;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const body = matchedData(req);
        const query = {
            createdAt: {
                [Op.between]: [moment(body.startDate), moment(body.endDate).endOf('day')]
            }
        };
        const authUser = await findUserById(req.currentUser);
        // Todo: Check user role and add query
        const pemasukan = await listPemasukan(limit, offset, query);
        return successResponse(res, Http.ok, "Success", pemasukan, false);
    } catch (error) {
        console.log(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const pengeluaran = async(req, res) => {
    try {
        const { limit, offset } = req.query;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const body = matchedData(req);
        const query = {
            createdAt: {
                [Op.between]: [moment(body.startDate), moment(body.endDate).endOf('day')]
            }
        };
        const authUser = await findUserById(req.currentUser);
        // Todo: Check user role and add query
        const pengeluaran = await listPengeluaran(limit, offset, query);
        return successResponse(res, Http.ok, "Success", pengeluaran, false);
    } catch (error) {
        console.log(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

module.exports = routes => {
    routes.get('/inventory', authentication, validation, inventory),
    routes.get('/pemasukan', authentication, validation, pemasukan),
    routes.get('/pengeluaran', authentication, validation, pengeluaran)
}