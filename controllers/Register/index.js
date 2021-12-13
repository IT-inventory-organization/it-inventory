const {body, validationResult} = require('express-validator');
const {passwordFormat, checkPhoneNumber} = require('../../helper/validation');
const {createHashText } = require('../../helper/bcrypt');
const InfoPengguna = require('../../database/models/info_pengguna');
const Token = require('../../database/models/tokenModel')
const { Op } = require('sequelize');
const { errorResponse, successResponse} = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const Encrypt = require('../../helper/encription');

const checkInputRegister = [
    body('namaPerusahaan').notEmpty().trim().withMessage('Nama Perusahaan Kosong'),
    body('npwp').notEmpty().trim().withMessage('NPWP Kosong'),
    body('alamat').notEmpty().trim().withMessage('Alamat Kosong'),
    body('nomorTelepon').notEmpty().trim().withMessage('Nomor Telepon Kosong'),
    body('bidangUsaha').notEmpty().trim().withMessage('Bidang Usaha Kosong'),
    body('namaPemilik').notEmpty().trim().withMessage('Nama Pemilik Kosong'),
    body('password').notEmpty().trim().custom(passwordFormat),
    body('email').notEmpty().trim().withMessage('Email Kosong'),
    body('confirmPassword').custom((value, {req}) => {
        if(typeof value === 'undefined' || value.length == 0){
            throw new Error("Confirm Password Cannot Empty");
        }
        if(value !== req.body.password){
            throw new Error('Password Confirmation dose not match with password');
        }
        return true;
    }).trim()
]

/**
 * * Decrypt Result And Create new Object 
 * @returns 
 */
const bundleRegister = (req, res, next) => {
    // console.log(req.body.dataRegister)
    try {
        const Decrypt = Encrypt.AESDecrypt(req.body.dataRegister);
        req.body = {
            ...Decrypt
        }
        // console.log(req.body)
        next()
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Data Tidak Sesuai")
    }
}

const register = async (req, res) => {
    /**
     * * Return Validation
     */
    const validation = validationResult(req);
    if(!validation.isEmpty()){
        return errorResponse(res, Http.badRequest, validation.array()[0].msg);
    }

    delete req.body.confirmPassword;
    
    const dataInput = {
        namaPerusahaan: req.body.namaPerusahaan,
        npwp: req.body.npwp,
        alamat: req.body.alamat,
        nomorTelepon: req.body.nomorTelepon,
        bidangUsaha: req.body.bidangUsaha,
        namaPemilik: req.body.namaPemilik,
        email: req.body.email,
        password: createHashText(req.body.password),
    }

    try {
        // Cari Data User Telebih dahulu
        const data = await InfoPengguna.findOne({
            where: {
                [Op.or]: [
                    {email: req.body.email},
                    {npwp: req.body.npwp},
                    
                ]
            }
        })
        // Jika Ada Maka Return Respon Error User Sudah Dibuat 
        if(data){
            return errorResponse(res, Http.badRequest, "Pengguna Sudah Ada")
        }

        // Jika Tidak Buat User Baru
        const resultUser = await InfoPengguna.create(dataInput, {returning: true});
        

        // Jika Gagal Maka Return Respon Error Gagal Memebut User Baru
        if(!resultUser){
            return errorResponse(res, Http.conflict, "Gagal Membuat Pengguna Baru");
        }

        return successResponse(res, Http.created, "Berhasil Membuat Pengguna Baru");
    } catch (error) {
        console.log(error)
        return errorResponse(res, Http.internalServerError, "Gagal Membuat Pengguna Baru")
    }
}

const forgotPassword = async (req, res) => {
    const {email} = req.body;
    User.findOne({ email }, (err,user) => {
        if(err || user) {
            return res.status(400).json({error: "User With This Email Does Not Exists"})
        }
    })

    let token = await Token.findOne({ userId: user._id });
        if (token) { 
            await token.deleteOne()
  };
}


module.exports = routes => {
    routes.post('/',  bundleRegister,checkInputRegister, register, forgotPassword)
}

