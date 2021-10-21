const reportDataTempatPenimbunan = require('../../database/models/datatempatpenimbunan');
const Report = require('../../database/models/report');
const { isExist } = require('../checkExistingDataFromTable');

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

const updateDataTempatPenimbunan = async (data, idReport, returning = false, transaction = null) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId: idReport
            }
        }
        await isExist(reportDataTempatPenimbunan, query)
        const result = await reportDataTempatPenimbunan.update(data, {
            where:{ 
                id: data.id,
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

const getDataTempatPenimbunan = async (idReport, type, transaction = null) => {
    try {
        const result = await reportDataTempatPenimbunan.get({
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
    createDataTempatPenimbunan,
    updateDataTempatPenimbunan,
    getDataTempatPenimbunan
}