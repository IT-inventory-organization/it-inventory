const reportDataLartas = require("../../database/models/datalartas");
const { isExist } = require("../checkExistingDataFromTable");


const createDataLartas = async (data, transaction) => {
    try {

        const result = await reportDataLartas.create(data, {
            transaction
        });
      
        return result;
    } catch (error) {
        throw Error(error.message);
    }
}

const updateDataLartas = async(data, idReport, transaction) => {
    try {
        const query = {
            where: {
                id: data.id,
                reportId: idReport
            }
        }
        await isExist(reportDataLartas, query);
        const result = await reportDataLartas.update(data, { 
            ...query,
            transaction
        });
        if(result[0] == 0){
            throw new Error(`Data Didn't Exists`);
        }
    } catch (error) {
        throw error;
    }
}

module.exports ={
    createDataLartas,
    updateDataLartas
}