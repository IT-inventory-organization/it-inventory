const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { checkHashText } = require('../../helper/bcrypt');
// const InfoPengguna = require('../../database/models/info_pengguna');
const po = require('../../database/models/po')
const Roles = require('../../database/models/role');
const Encryption = require('../../helper/encription');
const authentication = require('../../middlewares/authentication');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');

const validationLogin = [
    body('email').notEmpty().trim().withMessage('Email / NPWP / Username Kosong'),
    body('password').notEmpty().trim().withMessage('Password Kosong')
];


const getUserData = async(id) => {    
    return await InfoPengguna.findOne({
        where: {
            id,
            isActive: true
        },
        attributes:{
            exclude:['isActive', 'password', 'roleId', 'createdAt', 'updatedAt']
        }
    })
}

// const bundleLogin = (req, res, next) => {
//     try {
//         const Decrypt = Encryption.AESDecrypt(req.body.dataLogin);
//         req.body = {
//             ...Decrypt
//         }
//         // console.log(req.body);
//         next()
//     } catch (error) {
//         return errorResponse(res, Http.badRequest, "Data Tidak Sesuai")
//     }
// }

const getAllPO = async(req, res) => {
    // const validation = validationResult(req);
    // if(!validation.isEmpty()){
    //     return errorResponse(res, Http.badRequest, validation.array()[0].msg);
    // }

    try {
        // ambil User
        const resultLoginData = await getUserData(req.currentUser);
        
        // cek user ada / tidak
        if(!resultLoginData){
            return errorResponse(res, Http.notFound, `Pengguna Tidak Ada`);
        }

        // convert ke josn
        const result = resultLoginData.toJSON();
 
        return successResponse(res, Http.ok, "",result)
    } catch (error) {
        console.log(error)
        return errorResponse(res, Http.internalServerError, "Login Failed, cek usernam dan password")
    }
}

module.exports = routes => {
    routes.get('/', authentication ,getAllPO)
}