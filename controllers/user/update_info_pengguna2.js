const {body, validationResult} = require('express-validator');
const InfoPengguna = require('../../database/models/info_pengguna');
const { errorResponse, successResponse} = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const Encrypt = require('../../helper/encription');
const authentication = require('../../middlewares/authentication');
const httpStatus = require('../../helper/Httplib');

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
        delete req.body.InfoPengguna;
        next()
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Data Tidak Sesuai")
    }
}

const onUpdateValidation = [
    body('namaPerusahaan')
        // .optional()
        .notEmpty().withMessage('Nama perusahaan kosong')
        .trim(),
    body('npwp')
        // .optional()
        .notEmpty().withMessage('NPWP kosong')
        .trim(),
    body('alamat')
        // .optional()
        .notEmpty().withMessage('Alamat kosong')
        .trim(),
    body('nomorTelepon')
        // .optional()
        .notEmpty().withMessage('Nomor telepon kosong')
        .trim(),
    body('fax')
        // .optional()
        .trim(),
    body('bidangUsaha')
        // .optional()
        .notEmpty().withMessage('Bidang usaha kosong')
        .trim(),
    body('namaPemilik')
        // .optional()
        .notEmpty().withMessage('Nama pemilik kosong')
        .trim(),
    body('alamatPemilik'),
        // .optional(),
    body('email')
        // .optional()
        .notEmpty().withMessage('Email kosong')
        .isEmail().withMessage('Email tidak valid')
        .trim(),
    body('username')
        // .optional()
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

const updateInfoPengguna = async (req, res) => {
    try {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return errorResponse(res, httpStatus.badRequest, errors.array()[0].msg, "");
        }
        
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
        await InfoPengguna.update(req.body, {
            where: {
                id: req.currentUser,
                isActive:true
            }
        });

        return successResponse(res, Http.created, "Berhasil Mengupdate");
    } catch (error) {
        return errorResponse(res, Http.internalServerError, "Gagal Mengupdate")
    }
}

module.exports = routes => {
    routes.put('/', authentication ,bundleInfoPengguna ,onUpdateValidation ,updateInfoPengguna)
}