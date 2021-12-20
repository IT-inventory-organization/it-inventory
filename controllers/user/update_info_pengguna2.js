const {body, validationResult} = require('express-validator');
const InfoPengguna = require('../../database/models/info_pengguna');
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

        // return;
        next()
    } catch (error) {
        // cons

        return errorResponse(res, Http.badRequest, "Data Tidak Sesuai")
    }
}

const updateInfoPengguna = async (req, res) => {

    try {
        // Cari Data User Telebih dahulu
        const data = await InfoPengguna.findOne({
            where: {
                id: req.currentUser,
                isActive:true
            }
        })

        // Jika Ada Maka Return Respon Error User Sudah Dibuat 
        if(!data){
            return errorResponse(res, Http.notFound, "Data User Tidak Ada")
        }

        // Jika Tidak Buat User Baru
        const resultUser = await InfoPengguna.update(req.body, {
            where: {
                id: req.currentUser,
                isActive:true
            },
            returning:true
        });



        return successResponse(res, Http.created, "Berhasil Mengupdate");
    } catch (error) {

        return errorResponse(res, Http.internalServerError, "Gagal Mengupdate")
    }
}

module.exports = routes => {
    routes.put('/', authentication ,bundleInfoPengguna, updateInfoPengguna)
}