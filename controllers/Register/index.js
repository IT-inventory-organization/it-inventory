const {body, validationResult } = require('express-validator');
const {passwordFormat, checkPhoneNumber}= require("../../helper/validation");
const {createHashText } = require('../../helper/bcrypt');
const User = require('../../database/models/user');
const { Op } = require('sequelize');
const {errorResponse, successResponse} = require('../../helper/Response')
const httpStatus = require("../../helper/Httplib");
const Encryption = require('../../helper/encription');

const checkInputRegister = [
    body('owner_name').notEmpty().trim().withMessage("Name Is Required"), // Owner Name 
    body('npwp').notEmpty().trim().withMessage("NPWP Is Required"), // 
    body('address_company').notEmpty().trim().withMessage("Address Is Required").isLength({min: 10}), // Address Company
    body('email').notEmpty().isEmail().withMessage("Email is Required").trim(),
    body('mobile_phone').notEmpty().withMessage("Mobile Phone Number Is Required").trim().custom( checkPhoneNumber ),
    body('username').notEmpty().withMessage("Username is Required").trim(),
    body('password').notEmpty().trim().custom(value => passwordFormat(value)).withMessage("Password is Required"),
    // body('phone').notEmpty().custom(checkPhoneNumber).withMessage("Phone Number is Required").trim(),
    body('confirmPassword').custom((value, {req}) => {
        if(typeof value === 'undefined' || value.length == 0){
            throw new Error("Confirm Password Cannot Empty");
        }
        if(value !== req.body.password){
            throw new Error('Password Confirmation dose not match with password');
        }
        return true;
    }).trim(),
    body('company_name').notEmpty().trim().withMessage("Company Name Is Required"),
    body('business_field').notEmpty().trim().withMessage("Business Field Is Required")
];

const bundleReg = (req, res, next) => {
    try {
        const Decrypt = Encryption.AESDecrypt(req.body.dataRegister);
        req.body = {
            ...Decrypt
        };
        console.log(req.body);
        delete req.body.dataRegister;
        
        next();
    } catch (error) {
    
        throw error;
    }
}

async function Register(req, res){

    const validation = validationResult(req);
    if(!validation.isEmpty()){
        let i = 1;
        if(typeof validation.array()[i] === 'undefined'){
            i = 0
        }
    
        return errorResponse(res, httpStatus.badRequest, validation.array()[i].msg);
    }
    
    delete req.body.confirmPassword
    const dataToInput = {
        ...req.body
    }

    try {
        // Ambil Data User 
        const data = await User.findOne({
            where: {
                [Op.or]: [
                    {email: req.body.email},
                    {npwp: req.body.npwp},
                    {username: req.body.username}
                ]
            }
        });

        // Jika Sudah ada
        if(data){
            return errorResponse(res, httpStatus.badRequest, 'User is already exists');
        }

        await User.create(dataToInput);

        return successResponse(res, httpStatus.created, "Registration Success", {email: req.body.email})
    } catch (error) {
        console.log(error)
        return errorResponse(res, httpStatus.internalServerError, 'Registeration Seems Failed, Please Try Again Later', error.message)
    }
}

// async function deactivated(req, res) {
//     try {
//         const data = await User.update({
//             is_active: false,
//         }, {
//             where: {
//                 id: req.params.id
//             },
//             returning: true
//         });
//         returnValue.message = 'Berhasil Menghapus User ';
//         returnValue.status = true;
//         returnValue.data = {
//             email: data.email,
//             id: data.id
//         };

//         return res.json(returnValue).status(200);
//     } catch (error) {
//         returnValue.message = 'Gagal Untuk Menghapus User';
//         returnValue.status = false;
//         returnValue.data = {};
//         return res.json(returnValue).status(201);
//     }
// }

module.exports = (routes) => {
    routes.post('/', 
        bundleReg,
        checkInputRegister, 
        Register
    )
    // routes.post('/deactivated/:id', deactivated)
}