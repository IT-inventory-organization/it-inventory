const { database } = require('pg/lib/defaults');
const reportListBarang = require('../../database/models/listbarang');
const Report = require('../../database/models/report');
const authorization = require('../authorization');
const Barang = require('../../database/models/barang');

const createListBarang = async (data, transaction = null, reportId = null) => {
    try {
        const found = await Barang.findOne({
            where: {
                id: data.idBarang,
            }
        });

        if(!found){
            throw new Error(`Data Not Found`)
        }
        
        const foundR = await Report.findOne({
            where: {
                id: reportId
            }
        });

        if(!foundR){
            throw new Error(`Data Not Found`);
        }
        
        const jenisPemberitahuan = foundR.toJSON().jenisPemberitahuan;

        const qty = found.toJSON().stock;

        if((/(export)/gi).test(jenisPemberitahuan)){
            if(data.quantity > qty){
                return {
                    error: `Stock ${found.name} Cannot Lower Then Quantity`
                }
            }
        }
        
        const result = await reportListBarang.create(data, {
            transaction: transaction,
            returning: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        
        return result;
    } catch (error) {
        console.log(error)
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

const fullDelete = async (req, idListBarang = null, idReport, transaction = null, returning = false) => {
    try {
        if(!await authorization(reportListBarang, idReport, req, true)){
            throw new Error(`User Is Not Authorized To Access Data`);
        }

        
        const result = await reportListBarang.destroy(
            {
                where: {
                    // idBarang: idListBarang,
                    reportId: idReport
                },
                transaction: transaction,
                returning: returning,
                logging: console.log
            }
        )
        // console.log(result);return;
        
        return result;
    } catch (error) {
        console.log(error)
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