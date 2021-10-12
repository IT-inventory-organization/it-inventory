const { Op } = require('sequelize')
const listItem = require('../../database/models/barang');
const {authUser} = require('../../helper/authBarang');

module.exports={
    createListItem: async (data, transaction = null) => {
        try {
            const result = await listItem.create(data, {
                transaction: transaction
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    softDeleteListItem: async (req, id, transaction = null) => {
        try {
            if(!await authUser(listItem, id, req, true)){
                throw new Error('User Is Not Authorized To Delete List Item');
            }
            const result = await listItem.update({
                    isDelete: true
                }, {
                    where: {
                        id
                    },
                    transaction: transaction,
                    returning: true
                }
            );
            if(result[0] == 0){
                throw new Error(`Data Din't Exists`);
            }
            return result;
        } catch (error) {
            throw error;
        }
    },

    updateDeleteListItem: async (req, id, data, transaction = null) => {
        try {
            
            if(! await authUser(listItem, req.currentUser, req, true)){
                throw new Error(`User is not authorized to Edit List Item`);
            }
            
            if(data.id){
                delete data.id;
            }
            const result = await listItem.update(data, {
                where: {
                    id
                },
                transaction: transaction
            })
            
            return result;
        } catch (error) {
            throw error
        }
    },

    getListItem: async (req, param = {id: null, search: null, pageSize: 10, pageNo: 1}) => {
        try {
            const {id, search, pageSize, pageNo} = param;
            const limit = pageSize ? +pageSize : 10;
            const offset = pageNo ? (+pageNo - 1) * pageSize : 0;
            let query = {};

            if(id){
                if(!await authUser(listItem, id, req, true)){
                    throw new Error(`User is Not Authorized To Access Data`)
                }
                query = {
                    ...query,
                    where:{
                        userId: req.currentUser,
                        id: id,
                        isDelete: false
                    }
                }
            }else{
                query = {
                    ...query,
                    where: {
                        userId: req.currentUser,
                        isDelete: false
                    },
                    limit: limit,
                    offset: offset
                }
            }

            if(search){
                query = {
                    ...query,
                    [Op.or]: [
                        {posTarif: `${search}`},
                        {hsCode: `${search}`},
                        {uraian: `${search}`},
                        {satuanKemasan: `${search}`},
                        {nettoBrutoVolume: `${search}`},
                        {quantity: `${search}`},
                        {nilaiPabeanHargaPenyerahan: `${search}`}
                    ]
                };
            }

            if(id){
                if(!await authUser(listItem, id, req, true)){
                    throw new Error(`User Is Not Authorized to Access Data`)
                }
                query = {
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'isDelete', 'userId']
                    }
                }
                const result = await listItem.findOne(query);
                return result
            }else{
                query = {
                    ...query,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'isDelete', 'userId']
                    }
                }

                const result = await listItem.findAll(query);
                return {
                    data: result,
                    data_size: +result.length,
                    page_size: +limit,
                    page: +pageSize || 1
                };
            }
        } catch (error) {
            throw error
        }
    }
}