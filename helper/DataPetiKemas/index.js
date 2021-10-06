const reportDataPetiKemas = require('../../database/models/datapetikemas')

const createDataPetiKemas = async (data, transaction) => {
    try {
        const result = await reportDataPetiKemas.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateDataPetiKemas = async (data, idToUpdate , returning = false, transaction = null) => {
    try {
        const result = await reportDataPetiKemas.update(data, {
            where:{ 
                // id: idToUpdate,
                reportId: idToUpdate
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
    createDataPetiKemas,
    updateDataPetiKemas
}