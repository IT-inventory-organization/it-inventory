// const express = require('express');
const {createHashText, checkHashText } = require('../../helper/bcrypt');
let returnValue = {
    Message: '',
    status: false,
    data: {}
};

module.exports = (routes) => {
    routes.get('/', (req, res) => {

        returnValue.data = {
            encrypt: create
        }
        res.json(returnValue).status(200);
    })
}