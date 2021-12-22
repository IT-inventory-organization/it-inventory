const { body, validationResult, matchedData } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { createHashText, checkHashText } = require('../../helper/bcrypt');
const Approval = require('../../database/models/approval');
const BCF3315 = require('../../database/models/bcf3315');
const InfoPengguna = require('../../database/models/info_pengguna');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');

const findUserById = async(id) => {    
    return await InfoPengguna.findOne({
        where: {
            id,
            isActive: true
        },
        attributes:{
            exclude: ['isActive', 'password', 'roleId', 'createdAt', 'updatedAt']
        }
    });
}

const list = async(req, res) => {
    try {
        const query = {};
        const approval = await Approval.findAll({
            ...query
        });

        return successResponse(res, Http.ok, "Success", approval, false);
    } catch (error) {
        console.error(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const onApproveValidation = [
    body('bcfId')
        .notEmpty().withMessage('ID barang kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .custom(value => {
            return BCF3315.findOne({ where: { id: value } })
               .then((d) => {
                    console.log(d);
                    if (!d) return Promise.reject('BCF 3315 tidak ditemukan');
                });
         })
        .trim(),
    body('nomor')
        .notEmpty().withMessage('Nomor kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .trim(),
];

const approve = async(req, res) => {
    let transaction;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const body = matchedData(req);
        const authUser = await findUserById(req.currentUser);

        transaction = await sequelize.transaction();

        const approval = await Approval.create({
            status: 'DISETUJUI',
            bcfId: body.bcfId,
            userId: authUser.id
        }, { transaction });

        const updateBCF = await BCF.update({
            status: 'DISETUJUI',
            nomorbcf3314: body.nomor
        }, {
            where: {
                id: approve.bcfId
            }
        });

        if (transaction) await transaction.commit();
        return successResponse(res, Http.ok, "Success", approval, false);
    } catch (error) {
        console.error(error);
        if (transaction) await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const onReviseValidation = [
    body('bcfId')
        .notEmpty().withMessage('ID barang kosong')
        .isNumeric().withMessage('Isi dengan angka')
        .custom(value => {
            return BCF3315.findOne({ where: { id: value } })
               .then((d) => {
                    if (!d) return Promise.reject('BCF 3315 tidak ditemukan');
                });
         })
        .trim(),
    body('alasan')
        .optional()
        .trim(),
];

const revise = async(req, res) => {
    let transaction;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const body = matchedData(req);
        const authUser = await findUserById(req.currentUser);

        transaction = await sequelize.transaction();

        const approval = await Approval.create({
            status: 'PERBAIKAN',
            bcfId: body.bcfId,
            userId: authUser.id,
            alasan: body.alasan
        }, { transaction });

        const updateBCF = await BCF.update({
            status: 'PERBAIKAN'
        }, {
            where: {
                id: approve.bcfId
            }
        });
        if (transaction) await transaction.commit();
        return successResponse(res, Http.ok, "Success", approval, false);
    } catch (error) {
        console.error(error);
        if (transaction) await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const getAlldisetujui = async (req, res) => {
    try{
        let id = req.params.id;
        let data = await BCF3315.findAll({
            where: {
                status: "DISETUJUI"
            }
        })
        return successResponse(res, Http.ok, 'success', data, false);
    }catch(error){
        console.error(error);
        return errorResponse(res, Http.internalServerError, 'terjadi kesalahan server')
    }
}

const getAllPerbaikan = async (req, res) => {
    try{
        let id = req.params.id;
        let data = await BCF3315.findAll({
            where: {
                status: 'PERBAIKAN'
            }
        })
        return successResponse(res, Http.ok, 'success', data, false);
    }catch(error){
        console.error(error);
        return errorResponse(res, Http.internalServerError, 'terjadi kesalahan server')
    }
}

module.exports = routes => {
    routes.get('/', authentication, list),
    routes.post('/approve', authentication, onApproveValidation, approve),
    routes.post('/revise', authentication, onReviseValidation, revise),
    routes.get('/getAlldisetujui', authentication, getAlldisetujui),
    routes.get('/getAllPerbaikan', authentication, getAllPerbaikan)
}