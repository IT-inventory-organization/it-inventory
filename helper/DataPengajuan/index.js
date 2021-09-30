const reportDataPengajuan = require('../../database/models/datapengajuan')

const createDataPengajuan = async (data, transaction) => {
    try {
        const result = await reportDataPengajuan.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateDataPengajuan = async (data, idToUpdate, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportDataPengajuan.update(data, {
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
    createDataPengajuan,
    updateDataPengajuan
}