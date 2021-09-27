const {body, validationResult } = require('express-validator');
const {passwordFormat}= require("../../helper/validation");
const {createHashText, checkHashText } = require('../../helper/bcrypt');
const User = require('../../database/models/user');
const sequelize = require('../../configs/database');
const {DataTypes} = require('sequelize');
const { use } = require('nconf');

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
    body('name').notEmpty().trim().withMessage("Name Is Required"),
    body('npwp').notEmpty().trim().withMessage("NPWP Is Required"),
    body('address').notEmpty().trim().withMessage("Address Is Required").isLength({min: 10}),
    body('email').notEmpty().isEmail().withMessage("Email is Required"),
    body('mobile_phone').notEmpty().custom( checkPhoneNumber ).withMessage("Mobile Phone Number Is Required"),
    body('username').notEmpty().withMessage("Username is Required"),
    body('password').notEmpty().custom(value => passwordFormat(value)).withMessage("Password is Required"),
    body('phone').notEmpty().custom(checkPhoneNumber).withMessage("Phone Number is Required").trim(),
    body('confirmPassword').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Password Confirmation dose not match password');
        }

        return true;
    }).withMessage("Confirm Password Value Is Empty")
]

module.exports = (routes) => {
    routes.post('/', checkInputRegister, async (req, res) => {

        const validation = validationResult(req);
        // console.log(val);
        if(!validation.isEmpty()){
            res.json(validation.array()).status(400);
            return;
        }

        const obj = {
            name: req.body.name,
            address: req.body.address,
            npwp: req.body.npwp,
            email: req.body.email,
            mobile_phone: req.body.mobile_phone,
            username: req.body.username,
            password: req.body.password,
            is_active: 1,
            phone: req.body.phone
        }

        const user = User(sequelize, DataTypes);
        // console.log(user)
        const us = user.build(obj)
        await us.save();
        // await user.save();
        // return;
        res.json({
            asd: user 
        }).status(200);
    })

    routes.get('/test', (req, res) => {
        res.json({
            asd: checkHashText('$2b$10$2YFH/MxUsPq8wMD6qofV4u3Nk7ZlCfVbnB1Tgy.u2FUC5LEx6w9xi','123')
        }).status(200)
    })
}