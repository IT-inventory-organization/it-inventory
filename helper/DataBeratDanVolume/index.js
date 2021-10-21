const reportDataBeratDanVolume = require('../../database/models/databeratdanvolume');
const Report = require('../../database/models/report');
const { isExist } = require('../checkExistingDataFromTable');

const createDataBeratDanVolume = async (data, transaction) => {
    try {
        const result = await reportDataBeratDanVolume.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateDataBeratDanVolume = async (data, idReport, returning = false, transaction = null) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId: idReport
            }
        }
        await isExist(reportDataBeratDanVolume, query);
        const dataBeratDanVolumeExistance = await reportDataBeratDanVolume.findOne({
            where: {
                id: data.id,
                reportId: idReport
            },
            returning,
            transaction
        });
        if(!dataBeratDanVolumeExistance){
            throw new Error('Data Not Found');
        }
        const result = await reportDataBeratDanVolume.update(data, {
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

const getDataBeratDanVolume = async (idReport, type, transaction = null) => {
    try {
        const result = await reportDataBeratDanVolume.get({
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
    createDataBeratDanVolume,
    updateDataBeratDanVolume,
    getDataBeratDanVolume
}