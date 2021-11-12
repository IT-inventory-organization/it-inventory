const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { checkHashText } = require('../../helper/bcrypt');
const getInfoPengguna = require('./getInfoPengguna')
const Roles = require('../../database/models/role');
const Encryption = require('../../helper/encription');
const authentication = require('../../middlewares/authentication');
const Crypt = require('../../helper/encription');
const sequelize = require('../../configs/database');

const validationInfoPengguna = [
    body('lists.dataInfoPengguna.*.namaPerusahaan').trim().notEmpty().withMessage(`"Pos Tarif Is Required`),
    body('lists.dataInfoPengguna.*.npwp').trim().notEmpty().withMessage(`npwp is Required`),
    body('lists.dataInfoPengguna.*.alamat').trim().notEmpty().withMessage(`"alamat" Is Required`),
    body('lists.dataInfoPengguna.*.nomorTelepon').trim().notEmpty().withMessage(`"nomorTelepon" Is Required`),
    body('lists.dataInfoPengguna.*.bidangUsaha').trim().notEmpty().withMessage('Bidang Usaha required'),
    body('lists.dataInfoPengguna.*.namaPemilik').trim().notEmpty().withMessage('Nama Pemilik required')
    
]

const bundle = (req, res, next) => {
    try {
        const Decrypt = Crypt.AESDecrypt(req.body.dataInfoPengguna);

        for (let i = 0; i < Decrypt.listDataInfoPengguna.length; i++) {
            Decrypt.listDataInfoPengguna[i].reportId = Decrypt.reportId;

        }
        req.body.lists = {
            dataInfoPngguna: Decrypt.listDataInfoPengguna,
            reportId: Decrypt.reportId
        }
        next();    
    } catch (error) {
        throw errorResponse(res, Http.badRequest, 'Failed To Add Info Pengguna');
    }
}

const updateInfoPengguna = async(req, res) => {
    try {
        const validationInfoPengguna= validationInfoPenggunaResult(req);
        if(!validationInfoPengguna.isEmpty()){
            return errorResponse(res, Http.badRequest, validation.array()[0].msg);
        }

        const {id} = req.params;
        const {dataInfoPengguna} = req.body;
        delete dataInfoPengguna.id;
        const result = await updateListdataInfoPengguna(req, id, dataInfoPengguna);

        return successResponse(res, Http.ok, "Success Update InfoPengguna", result)
    } catch (error) {
        return errorResponse(res, Http.badRequest, "Failed To Edit InfoPengguna")
    }
}

module.exports = routes => {
    routes.post('/', validationInfoPengguna, updateInfoPengguna)
}