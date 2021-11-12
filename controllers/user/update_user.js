const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
// const { generateToken } = require('../../helper/jwt');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
// const { checkHashText } = require('../../helper/bcrypt');
const InfoPengguna = require('../../database/models/info_pengguna');
const Roles = require('../../database/models/role');
const Encryption = require('../../helper/encription');

const validationLogin = [
    body('email').notEmpty().trim().withMessage('Email / NPWP / Username Kosong'),
    body('password').notEmpty().trim().withMessage('Password Kosong')
];

const getUserData = async(email) => {    
    return await InfoPengguna.findOne({
        where: {
            [Op.or]: [
                {email: email},
                {npwp: email},
                {username: email}
            ],
            isActive: true
        },
        include: {
            model: Roles,
            attributes: ['name']
        }
    })
}

const bundleLogin = (req, res, next) => {
    try {
        const Decrypt = Encryption.AESDecrypt(req.body.dataLogin);
        req.body = {
            ...Decrypt
        }
        // console.log(req.body);
        next()
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Data Tidak Sesuai")
    }
}