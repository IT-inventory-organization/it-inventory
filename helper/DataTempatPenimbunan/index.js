const reportDataTempatPenimbunan = require('../../database/models/datatempatpenimbunan')

const createDataTempatPenimbunan = async (data, transaction) => {
    try {
        const result = await reportDataTempatPenimbunan.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateDataTempatPenimbunan = async (data, idToUpdate , returning = false, transaction = null) => {
    try {
        const result = await reportDataTempatPenimbunan.update(data, {
            where:{ 
                id: idToUpdate
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
    createDataTempatPenimbunan,
    updateDataTempatPenimbunan
}