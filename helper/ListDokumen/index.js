const reportListDokumen = require('../../database/models/listdokumen')

const createListDokumen = async (data, transaction) => {
    try {
        const result = await reportListDokumen.create(data, {
            transaction: transaction
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const updateListDokumen = async (data, idToUpdate , returning = false, transaction = null) => {
    try {
        const result = await reportListDokumen.update(data, {
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

const deleteListDokumen = async (idToDelete, returning = false, transaction = null) => {
    try {
        const result = await reportListDokumen.destroy({
            where: {
                id: idToDelete
            },
            returning: returning,
            transaction: transaction
        })
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createListDokumen,
    updateListDokumen
}