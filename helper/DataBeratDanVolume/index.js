const reportDataBeratDanVolume = require('../../database/models/databeratdanvolume')

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

const updateDataBeratDanVolume = async (data, idToUpdate, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportDataBeratDanVolume.update(data, {
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
    createDataBeratDanVolume,
    updateDataBeratDanVolume
}