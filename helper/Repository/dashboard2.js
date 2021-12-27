const dataKapal = require('../../database/models/data_kapal');
const dokumenPemasukan = require('../../database/models/dokumen_pemasukan');
const report = require('../../database/models/report');
const { ServerFault, NotFoundException } = require("../../middlewares/errHandler");

const getAllDashboard = async (req, id) => {
    try{
        const query = {
            include: [

            ]
        }
    return await Report.findAll(query);
    } catch (error) {
        throw error;
    }
}