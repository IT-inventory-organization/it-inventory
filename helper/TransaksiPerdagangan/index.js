const reportTransaksiPerdagangan = require('../../database/models/transaksiperdagangan');

const createReportTransaksiPerdagangan = async (data, transaction = null) => {
    try {
        const result = await reportTransaksiPerdagangan.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateReportTransaksiPerdagangan = async (data, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportTransaksiPerdagangan.update(data, {
            where: {
                id: data.id,
                reportId: idReport
            },
            returning: returning,
            transaction: transaction
        });
        if(result[0] == 0){
            throw new Error(`Data Didn't Exist`);
        }
        return result;
    } catch (error) {
        throw error
    }
}

module.exports = {
    createReportTransaksiPerdagangan,
    updateReportTransaksiPerdagangan
}