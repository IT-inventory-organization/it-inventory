const reportDataPetiKemasDanPengemas = require('../../database/models/datapetikemasdanpengemas');
const Report = require('../../database/models/report');

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

const updateDataPetiKemasDanPengemas = async (data, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportDataPetiKemasDanPengemas.update(data, {
            where:{ 
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
        throw error;
    }
}

const getDataPetiKemasDanPengemas = async (idReport, type, transaction = null) => {
    try {
        const result = await reportDataPetiKemasDanPengemas.get({
            include: [
                {
                    model: Report,
                    where: {
                        typeReport: type
                    }
                }
            ],
            where: {
                reportId: idReport,
            }
        })
    } catch (error) {
        throw error
    }
}

module.exports = {
    createDataPetiKemasDanPengemas,
    updateDataPetiKemasDanPengemas
}