const { body, validationResult, matchedData } = require('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { createHashText, checkHashText } = require('../../helper/bcrypt');
const Approval = require('../../database/models/approval');
const BCF3315 = require('../../database/models/bcf3315');
const InfoPengguna = require('../../database/models/info_pengguna');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');
const { changeStatusRepo, fetchBCF3315PerIdForBC } = require('../../helper/Repository/bcf3315');
const { UnAuthorizedUser, NotFoundException, Forbidden } = require('../../middlewares/errHandler');
const po = require('../../database/models/po');
const Report = require('../../database/models/report');
const PengusahaPLB = require('../../database/models/pengusaha_plb');
const { StatusCorrection, STATUS } = require('../../helper/Status.const');
const { onApproveValidation, onReviseValidation } = require('../../middlewares/ApproveEncrypt/ApprovalValidation');
const { ApproveDecrypt, ReviseDecrypt } = require('../../middlewares/ApproveEncrypt/ApprovalCorrection');

const findUserById = async(id) => {    
    return InfoPengguna.findOne({
        where: {
            id,
            isActive: true
        },
        attributes:{
            exclude: ['isActive', 'password', 'roleId', 'createdAt', 'updatedAt']
        }
    });
}

const getForCheck = async(id) => {
    const check = await BCF3315.findOne({
        where: {
            id: id
        }
    })

    return check.toJSON();
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

/**
 * Ambil IdBCF
 */
const approve = async(req, res) => {
    let transaction;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array()[0].msg);
        }
        const body = matchedData(req);
        
        if(req.currentRole !== 'BC'){
            throw new UnAuthorizedUser('Dilarang Untuk Mengapprove Dokumen');
        }

        transaction = await sequelize.transaction();

        const check = await getForCheck(body.idBCF);

        if(!check){
            throw new NotFoundException("Data Tidak Di Temukan", '', req);
        }

        if(check.status == STATUS.DISETUJUI){
            throw new Forbidden('Data Sudah Di Setujui', '', req);
        }

        const updateBCF = await BCF3315.update({
            status: STATUS.DISETUJUI,
            nomorbcf3314: body.nomor,
            userId: req.currentUser
        }, {
            where: {
                id: body.idBCF
            },
            transaction
        });

        if (transaction) await transaction.commit();
        return successResponse(res, Http.ok, "Success", "", false);
    } catch (error) {
        if (transaction) await transaction.rollback();
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const revise = async(req, res) => {
    let transaction;
    
    try {
        if(req.currentRole !== 'BC'){
            throw new UnAuthorizedUser("Dilarang Untuk Mengrevisi Dokumen", '', req);
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, Http.internalServerError, "Validation error", errors.array());
        }
        const body = matchedData(req);


        transaction = await sequelize.transaction();

        const check = await getForCheck(body.idBCF);

        if(!check){
            throw new NotFoundException("Data Tidak Di Temukan", '', req);
        }
    
        if(check.status == STATUS.PERBAIKAN){
            throw new Forbidden(`Status Data Sudah "PERBAIKAN"`, '', req);
        }

        const updateBCF = await BCF3315.update({
            status: STATUS.PERBAIKAN
        }, {
            where: {
                id: body.idBCF
            }
        });
        if (transaction) await transaction.commit();
        return successResponse(res, Http.ok, "Success", "", false);
    } catch (error) {
    
        if (transaction) await transaction.rollback();
        if(!error.status){
            return errorResponse(res, Http.internalServerError, "Terjadi Kesalahan Pada Server");    
        }
        return errorResponse(res, error.status, error.message);
    }
}

const getAlldisetujui = async (req, res) => {
    try{
        if(req.currentRole !== 'BC'){
            throw new UnAuthorizedUser(`Dilarang Untuk Mengakses`, '', req);
        }
        const data = await BCF3315.findAll({
            include: [
                {
                    model: InfoPengguna,
                    attributes: [['namaPemilik', 'nama'], 'nip']
                },
                {
                    model: po,
                    attributes: ['id'],
                    required: true,
                    include: [
                        {
                            model: Report,
                            attributes: ['id'],
                            include: [
                                {
                                    model: PengusahaPLB,
                                    attributes: ['namaPengusahaPLB']
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                status: "DISETUJUI"
            },
            attributes: ['nomorPO', 'tanggal', 'nomor']
        })
        return successResponse(res, Http.ok, 'success', data, true);
    }catch(error){
        if(!error.status){
            return errorResponse(res,Http.internalServerError, 'Terjadi Kesalahan Pada Server')
        }
        return errorResponse(res, error.status, error.message)
    }
}

const getAllPerbaikan = async (req, res) => {
    try{
        const data = await BCF3315.findAll({
            include: [
                {
                    model: InfoPengguna,
                    attributes: [['namaPemilik', 'nama'], 'nip']
                },
                {
                    model: po,
                    attributes: ['id'],
                    required: true,
                    include: [
                        {
                            model: Report,
                            attributes: ['id'],
                            include: [
                                {
                                    model: PengusahaPLB,
                                    attributes: ['namaPengusahaPLB']
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                status: 'PERBAIKAN',
            },
            attributes: ['nomorPO', 'tanggal', 'nomor']
        })
        return successResponse(res, Http.ok, 'success', data, true);
    }catch(error){
        console.error(error);
        return errorResponse(res, Http.internalServerError, 'terjadi kesalahan server')
    }
}

const getAllmenunggu = async (req, res) => {
    try{
        let data = await BCF3315.findAll({
            include: [
                {
                    model: po,
                    attributes: ['id', 'nomorPO'],
                    required: true,
                    include: [
                        {
                            model: Report,
                            attributes: ['id'],
                            include: [
                                {
                                    model: PengusahaPLB,
                                    attributes: ['namaPengusahaPLB']
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                status: 'MENUNGGU'
            },
            attributes: ['nomorPO', 'tanggal', 'nomor']
        })
        return successResponse(res, Http.ok, 'success', data, true);
    }catch(error){
        console.error(error);
        return errorResponse(res, Http.internalServerError, 'terjadi kesalahan server')
    }
}

const get = async(req, res) => {
    try{
        const id = req.params.id;
        const data = await fetchBCF3315PerIdForBC(req, id, true);
        if(!data){
            throw new NotFoundException("Data TIdak Ada", "", req);
        }
		return successResponse(res, Http.ok, "Success", data, false);
    } catch (error) {
        if(!error.status){
            return errorResponse(res, Http.internalServerError, "Terjadi Kesalahan Server");
        }
        return errorResponse(res, error.status, error.message);
    }
}

const getOneDisetujui = async(req, res) => {
    try{
        const {status, id} = req.params;
        
        const stats = StatusCorrection(req, status);
        
        const data = await fetchBCF3315PerIdForBC(req, id, stats)
        if(!data){
            throw new NotFoundException('Data Tidak DiTemukan', '', req);
        }
		return successResponse(res, Http.ok, "Success", data, true);
    } catch (error) {
        console.log(error)
        if(!error.status){
            return errorResponse(res, Http.internalServerError, "Terjadi Kesalahan Server");
        }
        return errorResponse(res, error.status, error.message);
    }
}

module.exports = routes => {
    routes.get('/', authentication, list); // *
    routes.put('/approve', authentication, ApproveDecrypt , onApproveValidation, approve); // *
    routes.put('/revise', authentication, ReviseDecrypt , onReviseValidation, revise);
    routes.get('/getAlldisetujui', authentication, getAlldisetujui); // *
    routes.get('/getAllPerbaikan', authentication, getAllPerbaikan); // *
    routes.get('/getAllmenunggu', authentication, getAllmenunggu); // *
    routes.get('/:id', authentication, get);
    routes.get('/getOneDetail/:status/:id', authentication, getOneDisetujui); // *
}