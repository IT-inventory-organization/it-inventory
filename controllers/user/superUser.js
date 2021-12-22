const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const {checkHashText} = require('../../helper/bcrypt');
const infoPengguna = require('../../database/models/info_pengguna');
const authentication = require('../../middlewares/authentication');
const httpStatus = require('../../helper/Httplib');


const list  = async (req, res) => {
    try {
        const pengguna = await infoPengguna.findAll({
        attributes : ['id', 'username', 'namaPemilik', 'roleEnum', 'isActive'],
        // include    : [{ 
        //     model: bar,
        //     attributes: attributes
        //     }]
        })
    return successResponse(res, Http.ok, "Success", pengguna, true);
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
        return successResponse(res, Http.ok, "Success", data, true);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "terjadi kesalahan server");
    }
}

const update = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.body;
        const updateDataPerId = await infoPengguna.findOne({
            where: {
                id: id
            }
        })
        const result = updateDataPerId.toJSON();
        await infoPengguna.update(body,{
            where: {
                id: id
            }
        })
        return successResponse(res, httpStatus.ok, result, 'Data berhasil di update!', '', true)
	}catch(error){
		return errorResponse(res, httpStatus.internalServerError, "Gagal Terjadi Kesalahan Pada Server", "")
	}
}

module.exports = routes => {
    routes.get('/list', authentication, list),
    routes.get('/get/:id', authentication, get ),
    routes.put('/update/:id', authentication, update)
}