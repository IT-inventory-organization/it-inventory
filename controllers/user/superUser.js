const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const {checkHashText} = require('../../helper/bcrypt');
const infoPengguna = require('../../database/models/info_pengguna');
const authentication = require('../../middlewares/authentication');
const httpStatus = require('../../helper/Httplib');
const sequelize = require('../../configs/database')


const list  = async (req, res) => {
    try {
        const sql = `select u.username, u."namaPemilik", u."roleEnum", u.status, au.aktifitasterakhir
        from "infoPengguna" u
        LEFT JOIN 
        (
            select "userId", max("createdAt") as aktifitasterakhir from "aktifitasUsers" GROUP BY "userId"
        ) au on au."userId"=u."id"
        `;

        // console.log(sql);
        // logging:console.log;

    const result = await sequelize.query(sql);
    // console.log(result);
    return successResponse(res, Http.ok, "Success", result, false);
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

const hapus = async (req, res) => {
    try{
        let id = req.params.id;
        const dataPerId = await infoPengguna.findOne({
            where: {
                id: id
            }
        })
        const result = dataPerId.toJSON();
        await infoPengguna.destroy({
            where: {
                id: id
            }
        })
        return successResponse(res, httpStatus.ok,  "Berhasil Di Hapus", result, true);
	}catch(error){
		return errorResponse(res, httpStatus.internalServerError, "Gagal Terjadi Kesalahan Pada Server", "")
	}
}



module.exports = routes => {
    routes.get('/list', authentication, list),
    routes.get('/get/:id', authentication, get ),
    routes.put('/update/:id', authentication, update),
    routes.delete('/delete/:id', authentication, hapus)
}