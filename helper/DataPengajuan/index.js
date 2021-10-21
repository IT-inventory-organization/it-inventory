const reportDataPengajuan = require('../../database/models/datapengajuan');
const authorization = require('../authorization');
const Report = require('../../database/models/report');
const { isExist } = require('../checkExistingDataFromTable');

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

const getDataPengajuan = async(idReport, type, transaction = null) => {
    try {
        const result = await reportDataPengajuan.get({
            include: [
                {
                    model: Report,
                    where: {
                        typeReport: type
                    },
                    through: {
                        attributes: []
                    }
                }
            ],
            where: {
                reportId: idReport,
            },
            transaction: transaction
        });

        return result
    } catch (error) {
        throw error;
    }
}

const updateDataPengajuan = async (data, idReport, returning = false, transaction = null) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId: idReport
            }
        }
        await isExist(reportDataPengajuan, query);
        const result = await reportDataPengajuan.update(data, {
            ...query,
            returning: returning,
            transaction: transaction
        });

        if(result[0] == 0){
            throw new Error(`Data Didn't Exists`);
        }
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createDataPengajuan,
    updateDataPengajuan,
    getDataPengajuan
}