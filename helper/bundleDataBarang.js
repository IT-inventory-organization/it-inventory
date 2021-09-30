const Http = require("./Httplib");
const {convertStrignToDateUTC} = require("./convert");
const {errorResponse} = require("./Response");
const Encryption = require('./encription');

const dataBarang = (req, res, next) => {
    try {
        req.DataToInput = {
            listBarang: req.body
        }
        next();
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Add Data", error)
    }
};

module.exports = {
    dataBarang
}