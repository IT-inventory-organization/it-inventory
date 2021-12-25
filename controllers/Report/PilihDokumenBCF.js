const { validationResult } = require("express-validator");
const httpStatus = require("../../helper/Httplib");
const { updateDokumnBCFAfterChoosingForPLB } = require("../../helper/Repository/bcf3315");
const { successResponse, errorResponse } = require("../../helper/Response");
const authentication = require("../../middlewares/authentication");
const { checkFormatData } = require("../../middlewares/BCFMiddlware/CheckDataChoosedDocument");
const { validationId } = require("../../middlewares/BCFMiddlware/UpdateBCFAfterChoosingDokumnForPLB");

const saveDokumenBCF = async(req, res) => {
    try {
        const validation = validationResult(req);
        if(!validation.isEmpty()){
            return errorResponse(res, Http.badRequest, validation.array()[0].msg);
        }

        const {idReport, listBCF} = req.body.data;
        for (const key in listBCF) {
            await updateDokumnBCFAfterChoosingForPLB(req, idReport, listBCF[key])
        }
        return successResponse(res, httpStatus.created, "");
    } catch (error) {
        console.log(error)
        return errorResponse(res, error.status, error.message);
    }
}

module.exports = routes => {
    routes.post('/save', authentication, checkFormatData, validationId, saveDokumenBCF)
}