const reportListBarang = require('../../database/models/listbarang');
const authorization = require('../authorization');

const createListBarang = async (data, transaction) => {
    try {
        const result = await reportListBarang.create(data, {
            transaction: transaction,
            returning: true
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

const softDeleteListBarang = async(idReport, req, transaction = null) => {
    try {
        if(!await authorization(reportListBarang, idReport, req, true)){
            throw new Error(`Your Not Authorized`);
        }
        // return;
        const result = await reportListBarang.update({
            isDelete: true
        }, {
            where: {
                reportId: idReport
            },
            transaction: transaction
        })
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteListBarang = async(idParams, returning = false, transaction = false) => {
    try {
        const result = await reportListBarang.update(
            {
                isDelete: true,
            },{
                where: {
                    id: idParams,
                },
                returning: returning,
                transaction: transaction
            }
        );
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createListBarang,
    updateListBarang,
    deleteListBarang,
    softDeleteListBarang
}