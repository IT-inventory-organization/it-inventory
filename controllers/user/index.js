const { Op } = require('sequelize');
const { body, validationResult, matchedData } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { createHashText, checkHashText } = require('../../helper/bcrypt');
const InfoPengguna = require('../../database/models/info_pengguna');
const Roles = require('../../database/models/role');
const Encryption = require('../../helper/encription');
const authentication = require('../../middlewares/authentication');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');

const findUserById = async(id) => {    
    return await InfoPengguna.findOne({
        where: {
            id,
            isActive: true
        },
        attributes:{
            exclude: ['isActive', 'password', 'roleId', 'createdAt', 'updatedAt']
        }
    });
}

const list = async(req, res) => {
    try {
        const authUser = await findUserById(req.currentUser);
        const users = await InfoPengguna.findAll({
            attributes: {
                exclude: ['password'],
            }
            // include: Roles
        });
 
        return successResponse(res, Http.ok, "Success", users, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const onCreateValidation = [
    body('namaPerusahaan')
        .notEmpty().withMessage('Nama perusahaan kosong')
        .trim(),
    body('npwp')
        .notEmpty().withMessage('NPWP kosong')
        .trim(),
    body('alamat')
        .notEmpty().withMessage('Alamat kosong')
        .trim(),
    body('nomorTelepon')
        .notEmpty().withMessage('Nomor telepon kosong')
        .trim(),
    body('bidangUsaha')
        .notEmpty().withMessage('Bidang usaha kosong')
        .trim(),
    body('namaPemilik')
        .notEmpty().withMessage('Nama pemilik kosong')
        .trim(),
    body('email')
        .notEmpty().withMessage('Email kosong')
        .isEmail().withMessage('Email tidak valid')
        .trim(),
    body('password')
        .notEmpty().withMessage('Password kosong')
        .isLength({ min: 6 }).withMessage('Minimal 6 karakter')
        .trim(),
    body('active')
        .isBoolean().withMessage('Active harus tipe boolean'),
];

const create = async(req, res) => {
    try {
        const authUser = await findUserById(req.currentUser);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const body = req.body;
        const user = await InfoPengguna.create({
            namaPerusahaan: body.namaPerusahaan,
            npwp: body.npwp,
            alamat: body.alamat,
            nomorTelepon: body.nomorTelepon,
            fax: body.fax,
            bidangUsaha: body.bidangUsaha,
            namaPemilik: body.namaPemilik,
            alamatPemilik: body.alamatPemilik,
            password: createHashText(body.password),
            // roleId: body.roleId,
            active: body.active,
            email: body.email,
            username: body.username,
            roleEnum: body.roleEnum,
        });
 
        return successResponse(res, Http.ok, "Success", user, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const onUpdateValidation = [
    body('namaPerusahaan')
        .optional()
        .notEmpty().withMessage('Nama perusahaan kosong')
        .trim(),
    body('npwp')
        .optional()
        .notEmpty().withMessage('NPWP kosong')
        .trim(),
    body('alamat')
        .optional()
        .notEmpty().withMessage('Alamat kosong')
        .trim(),
    body('nomorTelepon')
        .optional()
        .notEmpty().withMessage('Nomor telepon kosong')
        .trim(),
    body('fax')
        .optional()
        .trim(),
    body('bidangUsaha')
        .optional()
        .notEmpty().withMessage('Bidang usaha kosong')
        .trim(),
    body('namaPemilik')
        .optional()
        .notEmpty().withMessage('Nama pemilik kosong')
        .trim(),
    body('alamatPemilik')
        .optional(),
    body('email')
        .optional()
        .notEmpty().withMessage('Email kosong')
        .isEmail().withMessage('Email tidak valid')
        .trim(),
    body('username')
        .optional()
        .trim(),
    body('password')
        .optional()
        .notEmpty().withMessage('Password kosong')
        .isLength({ min: 6 }).withMessage('Minimal 6 karakter')
        .trim(),
    body('active')
        .optional()
        .isBoolean().withMessage('Active harus tipe boolean'),
    body('roleEnum')
        .optional()
];

const update = async(req, res) => {
    try {
        const authUser = await findUserById(req.currentUser);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const body = matchedData(req);
        const user = await InfoPengguna.findByPk(req.params.id);
        if (!user) return errorResponse(res, Http.notFound, "User not found");

        for (const key in body) {
            user[key] = body[key];
            if (key == 'password') {
                user[key] = createHashText(body[key]);
            }
        }
        await user.save();
 
        return successResponse(res, Http.ok, "Success", user, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const destroy = async(req, res) => {
    try {
        const authUser = await findUserById(req.currentUser);
        const user = await InfoPengguna.findByPk(req.params.id);
        if (user) user.destroy();
 
        return successResponse(res, Http.ok, "Success", null, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

module.exports = routes => {
    routes.get('/', authentication, list),
    routes.post('/create', authentication, onCreateValidation, create),
    routes.post('/:id/update', authentication, onUpdateValidation, update),
    routes.post('/:id/delete', authentication, destroy)
}