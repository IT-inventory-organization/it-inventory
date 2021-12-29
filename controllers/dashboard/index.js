const { body, validationResult, matchedData } = require ('express-validator');
const { errorResponse, successResponse } = require('../../helper/Response');
const Http = require('../../helper/Httplib');
const { listDashboard, getDashboard } = require('../../helper/Repository/dashboard3');
const infoPengguna = require('../../database/models/info_pengguna');
const authentication = require('../../middlewares/authentication');
const sequelize = require('../../configs/database');
const httpStatus = require('../../helper/Httplib');

const findUserById = async(id) => {
    return infoPengguna.findOne({
        where: {
            id,
            isActive: true
        },
        attributes: {
            exclude: ['isActive', 'password', 'roleId', 'createdAt', 'updatedAt']
        }
    })
}

const list = async(req, res) => {
    try {
        const { limit, offset } = req.query;
        const authUser = await findUserById(req.currentUser);
        const dashboard = await listDashboard(limit, offset);
        return successResponse(res, Http.ok, "Success", dashboard, false);
    } catch (error) {
        console.log(error);
        return errorResponse(res, Http.internalServerError, "Something went wrong");
    }
}

const getViewDashboard = async (req, res) => {
    try {
        const data = await listDashboard(req, req.currentUser);
        
        // for(const key in data.rows){
        //     console.log(data.rows[key]);
        //     if(Object.hasOwnProperty.call(data.rows, key)){
        //         const element = data.rows[key].toJSON();
        //         if(element?.dokumenPemasukan?.dokumenPengeluaran){
        //             delete data.rows[key];
        //         }
        //     }
        // }
        data.rows.flat()
        return successResponse(res, httpStatus.ok, "", data, false);
    } catch (error) {
        console.log(error);
        return errorResponse(res, httpStatus.internalServerError, "Gagal Mengambil Data", []);
    }
}


module.exports = routes => {
    routes.get('/', authentication, getViewDashboard);
}