const reportListBarang = require('../../database/models/listbarang')

const createListBarang = async (data, transaction) => {
    try {
        const result = await reportListBarang.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
    
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