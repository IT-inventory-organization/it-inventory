const Http = require("./Httplib");
const {errorResponse} = require("./Response");
const Encryption = require('./encription');

const bundleReport = (req, res, next) => {
    try {
        const Decrypt = Encryption.AESDecrypt(req.body.dataReport);
        const {type} = req.query;


        req.body.DataToInput = {
            ...Decrypt,
            typeReport: type,
            userId: req.currentUser
        };
        if(typeof type === 'undefined' || type == null ){
            delete req.body.DataToInput.typeReport
        }

        // console.log(req.body);return;

        next();
    } catch (error) {
        console.log(error)
        return errorResponse(res, Http.badRequest, "Failed To Add Data",)
    }
} 
module.exports = {
    bundleReport
}