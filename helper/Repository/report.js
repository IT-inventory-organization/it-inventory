const Report = require("../../database/models/report")
const { errorResponse } = require("../Response")

const saveReport = async(data) => {
    try {
        const result = await Report.create(data,{
            logging:true
        });
        
        return result;
    } catch (error) {
        console.log('Repository trigger',error)
        return false
    }
}

module.exports = {
    saveReport
}