const reportDataPetiKemasDanPengemas = require('../../database/models/datapetikemasdanpengemas')

const createDataPetiKemasDanPengemas = async (data, transaction) => {
    try {
        const result = await reportDataPetiKemasDanPengemas.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateDataPetiKemasDanPengemas = async (data, idToUpdate , returning = false, transaction = null) => {
    try {
        const result = await reportDataPetiKemasDanPengemas.update(data, {
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
    createDataPetiKemasDanPengemas,
    updateDataPetiKemasDanPengemas
}