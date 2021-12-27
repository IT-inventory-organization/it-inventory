const { errorResponse, successResponse } = require('../../helper/Response');
const authentication = require('../../middlewares/authentication');

const { getAllDashboard } = require('../../helper/Repository/dashboard');
const httpStatus = require('../../helper/Httplib');
const sequelize = require('../../configs/database');

// const getViewDashboard = saync (req, res) => {
//     try {
//         const
//     }
// }