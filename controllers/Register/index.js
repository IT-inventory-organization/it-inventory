const {body, validationResult } = require('express-validator');
const {passwordFormat, checkPhoneNumber}= require("../../helper/validation");
const {createHashText } = require('../../helper/bcrypt');
const User = require('../../database/models/user');

let returnValue = {
    message: '',
    status: false,
    data: {}
};


const checkInputRegister = [
    body('name').notEmpty().trim().withMessage("Name Is Required"),
    body('npwp').notEmpty().trim().withMessage("NPWP Is Required"),
    body('address').notEmpty().trim().withMessage("Address Is Required").isLength({min: 10}),
    body('email').notEmpty().isEmail().withMessage("Email is Required"),
    body('mobile_phone').notEmpty().custom( checkPhoneNumber ).withMessage("Mobile Phone Number Is Required"),
    body('username').notEmpty().withMessage("Username is Required"),
    body('password').notEmpty().custom(value => passwordFormat(value)).withMessage("Password is Required"),
    body('phone').notEmpty().custom(checkPhoneNumber).withMessage("Phone Number is Required").trim(),
    body('confirmPassword').custom((value, {req}) => {
        if(value.length == 0){
            throw new Error("Confirm Password Cannot Empty");
        }
        if(value !== req.body.password){
            throw new Error('Password Confirmation dose not match password');
        }

        return true;
    })
]

module.exports = (routes) => {
    routes.post('/', checkInputRegister, async (req, res) => {
        
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
            await User.create(dataToInput);

            returnValue.message = 'Registeration Success';
            returnValue.status = true;
            returnValue.data = {
                email: req.body.email
            };

            return res.json(returnValue).status(201);
        } catch (error) {
            returnValue.message = 'Regsiteration Seems Failed, Please Try Again Later';
            returnValue.status = false,
            returnValue.data = error.message;
            return res.json(returnValue).status(500);
        }
    })
}