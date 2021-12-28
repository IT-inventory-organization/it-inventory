const { AESDecrypt } = require("../../helper/encription");
const httpStatus = require("../../helper/Httplib");
const { errorResponse } = require("../../helper/Response");
const { BadRequest } = require("../errHandler");

const ApproveDecrypt = (req, res, next) => {
    try {
        const Decrypt = AESDecrypt(req.body.dataApprove);

        if(!Decrypt){
            throw new BadRequest("Inputan Kosong", '', req);
        }

        req.body = {
            ...Decrypt
        };

        next();
    } catch (error) {
        if(!error.status){
            return errorResponse(res, httpStatus.internalServerError, 'Terjadi Kesalahan Pada Server')
        }

        return errorResponse(res, error.status, error.message);
    }
}

const ReviseDecrypt = (req, res, next) => {
    try {
        const Decrypt = AESDecrypt(req.body.dataRevise);

        if(!Decrypt){
            throw new BadRequest("Inputan Kosong", '', req);
        }

        req.body = {
            ...Decrypt
        };

        next();
    } catch (error) {
        console.log(error)
        if(!error.status){
            return errorResponse(res, httpStatus.internalServerError, 'Terjadi Kesalahan Pada Server')
        }
        return errorResponse(res, error.status, error.message);
    }
}

module.exports = {
    ApproveDecrypt,
    ReviseDecrypt
}