const reportDataPelabuhanMuatBongkar = require('../../database/models/datapelabuhanmuatbongkar');
const Report = require('../../database/models/report');

const createDataPelabuhanMuatBongkar = async (data, transaction) => {
    try {
        const result = await reportDataPelabuhanMuatBongkar.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateDataPelabuhanMuatBongkar = async (data, idReport, returning = false, transaction = null) => {
    try {
        const result = await reportDataPelabuhanMuatBongkar.update(data, {
            where:{ 
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

const getDataPelabuhanMuatBongkar = async (idReport, type, transaction = null) => {
    try {
        const result = await reportDataPelabuhanMuatBongkar.get({
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
        })
    } catch (error) {
        
    }
}

module.exports = {
    createDataPelabuhanMuatBongkar,
    updateDataPelabuhanMuatBongkar,
    getDataPelabuhanMuatBongkar
}