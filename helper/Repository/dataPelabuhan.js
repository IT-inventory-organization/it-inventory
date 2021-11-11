const DataPelabuhan = require("../../database/models/data_pelabuhan")

const saveDataPelabuhan = async(data, transaction) => {
    try {
        const result = await DataPelabuhan.create(data, {
            transaction: transaction,
            returning: true
        });
        return result;
    } catch (error) {
        console.log('Repository, trigger', error)
        return false
    }
}

module.exports = {
    saveDataPelabuhan
}