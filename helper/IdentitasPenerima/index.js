const reportIdentitasPenerima = require('../../database/models/identitaspenerima');
const Report = require('../../database/models/report');
const { isExist } = require('../checkExistingDataFromTable');

const createReportIdentitasPenerima = async (data, transaction = null) => {
    try {
        const result = await reportIdentitasPenerima.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateReportIdentitasPenerima = async (data, idReport, returning = false, transaction = null) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId: idReport
            }
        }

        await isExist(reportIdentitasPenerima, query)

        const result = await reportIdentitasPenerima.update(data, {
            ...query,
            returning: returning,
            transaction: transaction
        })
        if(result[0] == 0){
            throw new Error(`Data Didn't Exist`);
        }
    } catch (error) {
        throw error
    }
}

const getIdentitasPenerima = async(idReport, type, transaction = null) => {
    
}

module.exports = {
    createReportIdentitasPenerima,
    updateReportIdentitasPenerima
}