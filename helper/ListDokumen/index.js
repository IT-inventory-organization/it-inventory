const reportListDokumen = require('../../database/models/listdokumen');
const authorization = require('../authorization');

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

const softDeleteListDokumen = async (reportId, req, transaction = null) => {
    try {
        if(!await authorization(reportListDokumen, reportId, req, true)){
            throw new Error('User Is Not Authorized To Access Data');
        }
                
        const result = await reportListDokumen.update({
            isDelete: true
        }, {
            where:{
                reportId: reportId
            },
            transaction: transaction,
            returning: true,
        });
        if(result == null){
            throw new Error("Data Didn\'t Exist");
        }
    } catch (error) {
        throw error;        
    }
}

const deleteListDokumen = async (idToDelete, returning = false, transaction = null) => {
    try {
        const result = await reportListDokumen.update(
            {
                isDelete: true
            },{
                where: {
                    id: idToDelete
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
    createListDokumen,
    updateListDokumen,
    deleteListDokumen,
    softDeleteListDokumen
}