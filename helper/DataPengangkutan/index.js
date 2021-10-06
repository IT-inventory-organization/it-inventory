const reportDataPengangkutan = require('../../database/models/datapengangkutan')

const createDataPengangkutan = async (data, transaction) => {
    try {
        const result = await reportDataPengangkutan.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateDataPengangkutan = async (data, idToUpdate, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportDataPengangkutan.update(data, {
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
    createDataPengangkutan,
    updateDataPengangkutan
}