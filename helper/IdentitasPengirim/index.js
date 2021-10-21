const reportIdentitasPengirim = require('../../database/models/identitaspengirim');
const { isExist } = require('../checkExistingDataFromTable');

const createReportIdentitasPengirim = async (data, transaction = null) => {
    try {
        const result = await reportIdentitasPengirim.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateReportIdentitasPengirim = async (data, idReport, returning = false, transaction = null) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId: idReport
            }
        }

        await isExist(reportIdentitasPengirim, query)
        const result = await reportIdentitasPengirim.update(data, {
            ...query,
            returning: returning,
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createReportIdentitasPengirim,
    updateReportIdentitasPengirim
}