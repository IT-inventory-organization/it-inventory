const reportPerkiraanTanggalPengeluaran = require('../../database/models/dataperkiraantanggalpengeluaran')

const createPerkiraanTanggalPengeluaran = async (data, transaction) => {
    try {
        const result = await reportPerkiraanTanggalPengeluaran.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updatePerkiraanTanggalPengeluaran = async (data, idToUpdate, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportPerkiraanTanggalPengeluaran.update(data, {
            where:{ 
                id: idToUpdate,
                reportId: idReport
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
    createPerkiraanTanggalPengeluaran,
    updatePerkiraanTanggalPengeluaran
}