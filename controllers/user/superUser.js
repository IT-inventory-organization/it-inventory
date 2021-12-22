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

const get = async (req, res) => {
    try{
        let id = req.params.id;
        let data = await infoPengguna.findOne({
            where: {
                id: id
            }
        })
        return res.json({
            status: "ok",
            data: data
        })
    }catch(error){
        res.status(500).json({
            status: 'error',
            data: error
        })
    }
}

const save = async (req, res) => {
    try{
        let body = req.body;
        let data = await infoPengguna.create(body);
        return res.json({
            status: 'ok',
            data: data
        })
    }catch(error){
        res.status(500).json({
            status: 'error',
            data: error
        })
    }
}


module.exports = routes => {
    routes.get('/list', authentication, list),
    routes.get('/get/:id', authentication, get )
}