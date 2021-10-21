const reportPerkiraanTanggalPengeluaran = require('../../database/models/dataperkiraantanggalpengeluaran')
const Report = require('../../database/models/report');
const { isExist } = require('../checkExistingDataFromTable');

const createPerkiraanTanggalPengeluaran = async (data, transaction) => {
    try {
        const result = await reportPerkiraanTanggalPengeluaran.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updatePerkiraanTanggalPengeluaran = async (data, idReport, returning = false, transaction = null) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId: idReport
            }
        } 

        await isExist(reportPerkiraanTanggalPengeluaran, query);

        const result = await reportPerkiraanTanggalPengeluaran.update(data, {
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

const getPerkiraanTanggalPengeluaran = async (idReport, type, transaction = null) => {
    try {
        const result = await reportPerkiraanTanggalPengeluaran.get({
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
    createPerkiraanTanggalPengeluaran,
    updatePerkiraanTanggalPengeluaran,
    getPerkiraanTanggalPengeluaran
}