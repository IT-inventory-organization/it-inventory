const reportIdentitasPenerima = require('../../database/models/identitaspenerima');
const Report = require('../../database/models/report');

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

const updateReportIdentitasPenerima = async (data, idIdentitasPenerima, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportIdentitasPenerima.update(data, {
            where: {
                id: idIdentitasPenerima,
                reportId: idReport
            },
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