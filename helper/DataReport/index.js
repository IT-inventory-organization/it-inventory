const Report = require('../../database/models/report');


const createReport = async (data, transaction) => {
    try {
        const result = await Report.create(data);
        return result;
    } catch (error) {
        throw Error(error.message);
    }
}

module.exports = {
    createReport
}