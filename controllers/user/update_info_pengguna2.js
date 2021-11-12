const {body, validationResult} = require('express-validator');
// const {passwordFormat, checkPhoneNumber} = require('../../helper/validation');
const {createHashText } = require('../../helper/bcrypt');
const InfoPengguna = require('../../database/models/info_pengguna');
const { Op } = require('sequelize');
const { errorResponse, successResponse} = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const Encrypt = require('../../helper/encription');
const authentication = require('../../middlewares/authentication');

/**
 * * Decrypt Result And Create new Object 
 * @returns 
 */
const bundleInfoPengguna = (req, res, next) => {
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.InfoPengguna);
        req.body = {
            ...Decrypt
        }
        // console.log(req.body)
        next()
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Data Tidak Sesuai")
    }
}

const updateInfoPengguna = async (req, res) => {

    try {
        // Cari Data User Telebih dahulu
        const data = await InfoPengguna.findOne({
            where: {
                id: req.curentUser,
                isActive:true
            }
        })
        console.log('asd',data);
        // Jika Ada Maka Return Respon Error User Sudah Dibuat 
        if(!data){
            return errorResponse(res, Http.notFound, "Data User Tidak Ada")
        }

        // Jika Tidak Buat User Baru
        const resultUser = await InfoPengguna.update(req.body, {
            where: {
                id: req.curentUser,
                isActive:true
            },
            returning:true
        });


        return successResponse(res, Http.created, "Berhasil Mengupdate", resultUser);
    } catch (error) {
        console.log(error)
        return errorResponse(res, Http.internalServerError, "Gagal Mengupdate")
    }
}

module.exports = routes => {
    routes.post('/', authentication ,bundleInfoPengguna, updateInfoPengguna)
}