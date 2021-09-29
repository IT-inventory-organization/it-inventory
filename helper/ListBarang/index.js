const reportListBarang = require('../../database/models/listbarang')

const createListBarang = (data) => {
    const result = reportListBarang.create(data);
    return result;
}

const updateListBarang = async (data, idToUpdate , returning = false, transaction = null) => {
    try {
        const result = await reportListBarang.update(data, {
            where:{ 
                id: idToUpdate
            },
            returning: returning,
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createListBarang,
    updateListBarang
}