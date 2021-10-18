const reportListBarang = require('../../database/models/listbarang');
const authorization = require('../authorization');

const createListBarang = async (data, transaction = null) => {
    try {
        const result = await reportListBarang.create(data, {
            transaction: transaction,
            returning: true,
            attributes: {
                includes: ['id'],
                exclude: ['createdAt', 'updatedAt']
            }
        });
        // console.log(result.toJSON());
        return result;
    } catch (error) {

        throw error;
    }
    
}

const fetchListBarang = async(req, idReport, transaction = null) => {
    try {
        const result = await reportListBarang.findAll({
            where: {
                reportId: idReport
            },
            attributes: {
                include: ['id', 'quantity', 'nilaiPabeanHargaPenyerahan', 'idBarang'],
                exclude:['createdAt', 'updatedAt', 'reportId']
            },
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

const softDeleteListBarang = async(idReport, req, transaction = null) => {
    try {
        if(!await authorization(reportListBarang, idReport, req, true)){
            throw new Error(`User Is Not Authorized To Access Data`);
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

const fullDelete = async (req, idListBarang, idReport, transaction = null, returning = false) => {
    try {
        if(!await authorization(reportListBarang, idReport, req, true)){
            throw new Error(`User Is Not Authorized To Access Data`);
        }

        const result = await reportListBarang.destroy(
            {
                where: {
                    id: idListBarang,
                    reportId: idReport
                },
                transaction: transaction,
                returning: returning
            }
        )

        return result;
    } catch (error) {
 
        throw error
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
    softDeleteListBarang,
    fullDelete,
    fetchListBarang,
    // getOneHistoryOnItem
}