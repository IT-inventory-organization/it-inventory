const reportDataLartas = require("../../database/models/datalartas");


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
        const result = await reportDataLartas.update(data, { 
            where: { 
                id: data.id,
                reportId: idReport
            },
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