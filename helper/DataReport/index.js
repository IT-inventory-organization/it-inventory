const { Op } = require('sequelize');
const Report = require('../../database/models/report');
const reportIdentitasPenerima = require('../../database/models/identitaspenerima');
const reportIdentitasPengirim = require('../../database/models/identitaspengirim');


const createReport = async (data, transaction) => {
    try {
        const result = await Report.create(data);
        return result;
    } catch (error) {
        throw Error(error.message);
    }
}

const getReportByType = async (type, transaction = null) => {
    try {
        const result = await Report.count({
            where: {
                [Op.and]: [
                    {'jenisPemberitahuan': type},
                    {'isDelete': false}
                ]
            },
            transaction: transaction
        });

        return result;
    } catch (error) {
        throw error;
    }
}
/**
 * 
 * @param {String} type 
 * @returns 
 */
const getRecentActivities = async (type, transaction = null) => {
    try {
        const result = await Report.findAll({
            where: {
                [Op.and]: [
                    {'jenisPemberitahuan': type},
                    {'isDelete': false}
                ]
            },
            order: [
                ['updatedAt', 'DESC']
            ],
            limit: 5,
            transaction: transaction,
        });
        // console.log(result)
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteReport = async(idType, transaction = null) => {
    try {
        const result = Report.update({
            isDelete: true,
        },{
            where: {
                id: idType
            }
        });

        return result;
    } catch (error) {
        throw error
    }
}

module.exports = {
    createReport,
    getReportByType,
    getRecentActivities,
    deleteReport
}

// const get = () => {
//     const resilt = await report.findAll({ 
//         attributes: {
//             'jenisInvetory'
//         },
//         includes: [
//             {
//                 model: reportIdentitasPenerima,
//                 attributes: {
//                     'jenisInvetory'
//                 }
//             },

//         ]
//     })
// }