const reportIdentitasPengirim = require('../../database/models/identitaspengirim');

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

const updateReportIdentitasPengirim = async (data, idIdentitasPengirim, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportIdentitasPengirim.update(data, {
            where: {
                id: idIdentitasPengirim,
                reportId: idReport,
            },
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