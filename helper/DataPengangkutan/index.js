const reportDataPengangkutan = require('../../database/models/datapengangkutan');
const Report = require('../../database/models/report');

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

const updateDataPengangkutan = async (data, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportDataPengangkutan.update(data, {
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

const getDataPengangkutan = async (idReport, type, transaction = null) => {
    try {
        const result = await reportDataPengangkutan.get({
            include: [
                {
                    model: Report,
                    where: {
                        typeReport: type,
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
        throw error
    }
}

module.exports = {
    createDataPengangkutan,
    updateDataPengangkutan,
    getDataPengangkutan
}