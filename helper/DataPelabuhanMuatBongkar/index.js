const reportDataPelabuhanMuatBongkar = require('../../database/models/datapelabuhanmuatbongkar')

const createDataPelabuhanMuatBongkar = async (data, transaction) => {
    try {
        const result = await reportDataPelabuhanMuatBongkar.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateDataPelabuhanMuatBongkar = async (data, idToUpdate, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportDataPelabuhanMuatBongkar.update(data, {
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
    createDataPelabuhanMuatBongkar,
    updateDataPelabuhanMuatBongkar
}