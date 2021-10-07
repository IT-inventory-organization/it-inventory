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

const updateDataPetiKemasDanPengemas = async (data, idToUpdate, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportDataPetiKemasDanPengemas.update(data, {
            where:{ 
                id: idToUpdate,
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
        throw error;
    }
}

module.exports = {
    createDataPetiKemasDanPengemas,
    updateDataPetiKemasDanPengemas
}