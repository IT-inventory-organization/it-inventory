const {body, validationResult } = require('express-validator');
const {passwordFormat, checkPhoneNumber}= require("../../helper/validation");
const {createHashText } = require('../../helper/bcrypt');
const User = require('../../database/models/user');
const { Op } = require('sequelize');

let returnValue = {
    message: '',
    status: false,
    data: {}
};

const checkInputRegister = [
    body('name').notEmpty().trim().withMessage("Name Is Required"),
    body('npwp').notEmpty().trim().withMessage("NPWP Is Required"),
    body('address').notEmpty().trim().withMessage("Address Is Required").isLength({min: 10}),
    body('email').notEmpty().isEmail().withMessage("Email is Required").trim(),
    body('mobile_phone').notEmpty().custom( checkPhoneNumber ).withMessage("Mobile Phone Number Is Required").trim(),
    body('username').notEmpty().withMessage("Username is Required").trim(),
    body('password').notEmpty().custom(value => passwordFormat(value)).withMessage("Password is Required").trim(),
    body('phone').notEmpty().custom(checkPhoneNumber).withMessage("Phone Number is Required").trim(),
    body('confirmPassword').custom((value, {req}) => {
        if(value.length == 0){
            throw new Error("Confirm Password Cannot Empty");
        }
        if(value !== req.body.password){
            throw new Error('Password Confirmation dose not match password');
        }

        return true;
    }).trim()
];

async function Register(req, res){
    const validation = validationResult(req);
        if(!validation.isEmpty()){
            res.json(validation.array()).status(400);
            return;
        }

        const dataToInput = {
            name: req.body.name,
            address: req.body.address,
            npwp: req.body.npwp,
            email: req.body.email,
            mobile_phone: req.body.mobile_phone,
            username: req.body.username,
            password: createHashText(req.body.password), // Hashing
            is_active: true,
            phone: req.body.phone
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
                returnValue.message = 'User is already exists';
                returnValue.status = false;
                returnValue.data = {};
                return res.json(returnValue).status(409)
            }

            await User.create(dataToInput);

            returnValue.message = 'Registeration Success';
            returnValue.status = true;
            returnValue.data = {
                email: req.body.email
            };

            return res.json(returnValue).status(201);
        } catch (error) {
            returnValue.message = 'Registeration Seems Failed, Please Try Again Later';
            returnValue.status = false,
            returnValue.data = error.message;
            return res.json(returnValue).status(500);
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
    routes.post('/', checkInputRegister, Register)
    // routes.post('/deactivated/:id', deactivated)
}