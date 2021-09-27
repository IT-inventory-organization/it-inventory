const {body, validationResult } = require('express-validator');
const {passwordFormat}= require("../../helper/loginValidation");
const {createHashText, checkHashText } = require('../../helper/bcrypt');
let returnValue = {
    Message: '',
    status: false,
    data: {}
};

function checkPhoneNumber(value){
    let mobile_number = value;
        if(typeof mobile_number !== 'string'){
            mobile_number = `${mobile_number}`;
        }
        if(!mobile_number.includes('+')){
            throw new Error(`Mobile Phone Number Must Include "+" Sign`);
        }

        return true
}

const checkInputRegister = [
    body('name').notEmpty(),
    body('npwp').notEmpty(),
    body('email').isEmail(),
    body('mobile_phone').custom( checkPhoneNumber ).notEmpty(),
    body('username').notEmpty(),
    body('password').notEmpty().custom(value => {
        
    }),
    body('phone').notEmpty().custom(checkPhoneNumber),
    body('confirmPassword').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Password Confirmation dose not match password');
        }

        return true;
    })
]

module.exports = (routes) => {
    routes.get('/', checkInputRegister, (req, res) => {

        res.json({
            asd: createHashText('123')
        }).status(200);
    })

    routes.get('/test', (req, res) => {
        res.json({
            asd: checkHashText('$2b$10$2YFH/MxUsPq8wMD6qofV4u3Nk7ZlCfVbnB1Tgy.u2FUC5LEx6w9xi','123')
        }).status(200)
    })
}