const {body, validationResult } = require('express-validator');
const {passwordFormat}= require("../../helper/validation");
const {createHashText, checkHashText } = require('../../helper/bcrypt');
const User = require('../../database/models/user');
const sequelize = require('../../configs/database');
const {DataTypes} = require('sequelize');
const { generateToken } = require('../../helper/jwt');

let returnValue = {
    message: '',
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
        let transaction;
        
        const validation = validationResult(req);
        // console.log(val);
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
            is_active: 1,
            phone: req.body.phone
        }
        try {
            transaction = await sequelize.transaction();
            
            const user = User(sequelize, DataTypes);

            const processSave = user.build(dataToInput)
            const dataToFetch = await processSave.save({
                transaction: transaction,
            });

            returnValue.message = 'Registeration Success';
            returnValue.status = true;
            returnValue.data = {
                email: req.body.email
            };
            
            await transaction.commit(); // Accept all Change

            res.json(returnValue).status(201);
        } catch (error) {
            await transaction.rollback(); // Revert All Change
            returnValue.message = 'Regsiteration Seems Failed, Please Try Again Later';
            returnValue.status = false,
            returnValue.data = error.message;
            res.json(returnValue).status(500);
        }
    })

    /**
     * Testing Purpose: Delet User
     */
    routes.delete('/:id/delete', async(req,res) => {
        try {
            const defineUser = User(sequelize, DataTypes);
            const define = await defineUser.destroy({
                where:{
                    id: req.params.id,
                }
            });

            res.json({
                define: define
            }).status(200)
        } catch (error) {
            returnValue.message = 'Failed Delete User';
            returnValue.status = false,
            returnValue.data = error
            res.json(returnValue).status(500);
        }
    })

    /**
     * Testing Bcrypt Password
     */
    routes.get('/test', async (req, res) => {
        try {
            const user = User(sequelize, DataTypes);
            const result = await user.findAll();
            
            res.json({
                message: 'Success Fetch All Data',
                status: true,
                data: result
            })
        } catch (error) {
            
        }
    })
}