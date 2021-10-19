const reportDataPetiKemas = require('../../database/models/datapetikemas');
const Report = require('../../database/models/report');
const { isExist } = require('../checkExistingDataFromTable');

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
        const query = {
            where: {
                id: data.id,
                reportId: idToUpdate
            }
        }

        await isExist(reportDataPetiKemas, query);
        const result = await reportDataPetiKemas.update(data, {
            where:{ 
                id: data.id,
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

const getDataPetiKemas = async (idReport, type, transaction = null) => {
    try {
        const result = await reportDataPetiKemas.get({
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
            },
            transaction: transaction
        });

        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createDataPetiKemas,
    updateDataPetiKemas,
    getDataPetiKemas
}