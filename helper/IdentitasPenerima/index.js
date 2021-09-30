const reportIdentitasPenerima = require('../../database/models/identitaspenerima');

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
    } catch (error) {
        
    }
}

module.exports = {
    createReportIdentitasPenerima,
    updateReportIdentitasPenerima
}