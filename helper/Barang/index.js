const Barang = require('../../database/models/barang');
const reportListBarang = require('../../database/models/listbarang');
const { authUser } = require('../../helper/authBarang');
const sequelize = require('../../configs/database');
const reportListDokumen = require('../../database/models/listdokumen');
const Report = require('../../database/models/report');
const reportIdentitasPenerima = require('../../database/models/identitaspenerima');
const {Op} = require('sequelize');
const Histories = require('../../database/models/history');

const findBarang = async (id, idUser = null) => {
    let query = {
        where: {
            id:id,
            isDelete: false
        }
    };

    if(idUser !== null){
        query = {
            ...query,
            userId: idUser,
        }
    }

    return await Barang.findOne(query);
}

module.exports={
    createListItem: async (data, transaction = null) => {
        try {
            const result = await Barang.create(data, {
                transaction: transaction
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    softDeleteListItem: async (req, id, transaction = null) => {
        try {
            if(!await authUser(Barang, id, req, true)){
                throw new Error('User Is Not Authorized To Delete List Item');
            }
            const findItem = await findBarang(id, req.currentUser);
            if(!findItem) {
                throw new Error(`Data Not Found`);
            }
            const result = await Barang.update({
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
                throw new Error(`Data Didn't Exists`);
            }
            return result;
        } catch (error) {
            return error;
        }
    },

    updateListItem: async (req, id, data, transaction = null) => {
        try {
            
            if(! await authUser(Barang, req.currentUser, req, true)){
                throw new Error(`User is not authorized to Edit List Item`);
            }

            const findItem = await findBarang(id, req.currentUser);

            if(!findItem) {
                throw new Error(`Data Not Found`)
            }
            
            if(data.id){
                delete data.id;
            }
            const result = await Barang.update(data, {
                where: {
                    id:id,
                    userId: req.currentUser
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
            let user = ``;
            let searchQuery = ``;
            
            const {id, search, pageSize, pageNo} = param;
            const limit = pageSize ? +pageSize : 10;
            const offset = pageNo ? (+pageNo - 1) * pageSize : 0;

            if(id){
                if(!await authUser(Barang, id, req, true)){
                    throw new Error(`User is Not Authorized To Access Data`)
                }
                user+=`AND barang."userId" = ${req.currentUser} AND barang.id = ${id}`;
            }else{
                user+=`AND barang."userId" = ${req.currentUser}`;
            }

            if(search){
                const column = ['posTarif', 'hsCode', 'uraian', 'satuanKemasan', 'nettoBrutoVolume', 'stock', 'nilaiPabeanHargaPenyerahan'];
                searchQuery+=`AND (`
                for (let i = 0; i < column.length; i++) {
                    const regex = new RegExp(/[A-Z]/g);
                    if(regex.test(column[i])) {
                        if(i == column.length - 1){
                            searchQuery+=` barang."${column[i]}"::text ILIKE '%${search}%' `;
                            continue;
                        }
                        searchQuery+=` barang."${column[i]}"::text ILIKE '%${search}%' OR` ;
                    }else{
                        if(i == column.length - 1){
                            searchQuery+=` barang.${column[i]}::text ILIKE '%${search}%' `;
                            continue;
                        }
                        searchQuery+=` barang.${column[i]}::text ILIKE '%${search}%' OR `;
                    }
                }
                searchQuery+=`)`
            }

            if(id){
                if(!await authUser(Barang, id, req, true)){
                    throw new Error(`User Is Not Authorized to Access Data`)
                }

                let sql = `SELECT barang.id, barang.uraian, barang."posTarif", barang."hsCode", barang."nettoBrutoVolume", barang."satuanKemasan", barang."nilaiPabeanHargaPenyerahan", barang.stock FROM "Barang" AS barang WHERE barang."isDelete" = false ${user}`;

                const result = await sequelize.query(sql);
                return result[0]
            }else{
                

                let sql = `SELECT barang.id, barang.uraian, barang."posTarif", barang."hsCode", barang."nettoBrutoVolume", barang."satuanKemasan", barang."nilaiPabeanHargaPenyerahan", barang.stock FROM "Barang" AS barang WHERE barang."isDelete" = false ${user} ${searchQuery} LIMIT ${limit} OFFSET ${offset}`



                const result = await sequelize.query(sql);
                return {
                    data: result[0],
                    data_size: +result[0].length,
                    page_size: +limit,
                    page: +pageSize || 1
                };
            }
        } catch (error) {
            throw error
        }
    },

    updateStockItem: async (req, id, status = null, total, notificationType = null, transaction = null) => {
        try {
            let query = {
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'isDelete', 'userId']
                },
                transaction: transaction,
                returning: true
            };
            let resultFindItem;

            if(req.currentRole !== 'Admin' && req.currentRole !== 'Owner'){
                resultFindItem = await findBarang(id, req.currentUser);
                query = {
                    where: {
                        id:id,
                        userId: req.currentUser
                    },
                    ...query
                }
                
            }else{
                resultFindItem = await findBarang(id);
                query = {
                    where: {
                        id:id
                    },
                    ...query
                }
            }
            
            if(!resultFindItem){
                throw new Error(`Data Not Found`);
            }
            
            let quantity = resultFindItem.stock;
            // console.log(quantity, total, notificationType);
            if(status != null){
                if((/(increase)/gi).test(status)){
                    quantity += (+total);
                }else if((/(decrease)/gi).test(status)){
                    if(quantity == 0){
                        throw new Error(`Stock ${resultFindItem.uraian} is Currently Empty`)
                    }
                    quantity -= (+total);
                    if(quantity <= 0){
                        throw new Error(`Stock ${resultFindItem.uraian} is Too Low`)
                    }
                }
            }else if(notificationType != null){
                if((/(export)/gi).test(notificationType)){
                    if(quantity == 0){
                        throw new Error(`Stock ${resultFindItem.uraian} is Currently Empty`)
                    }
    
                    quantity -= (+total);
                    
                    if(quantity <= 0){
                        throw new Error(`Stock ${resultFindItem.uraian} is Too Low`)
                    }
                }else if((/(import)/gi).test(notificationType)){
                    quantity += (+total);
                }
            }

            // console.log(query, req.currentRole);
            
            const result = await Barang.update({
                stock: quantity,
            }, query);
    
            return result;
        } catch (error) {

            throw error
        }
        
    },

    getItem: async(req) => {
        const result = await Barang.findAll();
        return result;
    },

    getOneHistoryOnItem: async (req, idBarang) => {
        try {
            let query = {
                where:{
                    userId: req.currentUser
                },
                attributes: {
                    include: ['uraian']
                }
            }
            if(idBarang){
                query = {
                    where: {
                        ...query.where,
                        id: idBarang
                    }
                }
            }
            query = {
                ...query,
                include: [
                    {
                        model: reportListBarang,
                        attributes: {
                            exclude: ['createdAt','updatedAt', 'idBarang', 'reportId']
                        },
                        include: {
                            model: Report,
                            attributes: {
                                exclude: ['pengajuanSebagai', 'kantorPengajuan', 'jenisMasuk', 'isEditable', 'userId', 'isDelete', 'createdAt']
                            },
                            include: [
                                {
                                    model: reportListDokumen,
                                    attributes: {
                                        include: ['nomorDokumen']
                                    }
                                },
                                {
                                    model: reportIdentitasPenerima,
                                    attributes: {
                                        include: ['namaPenerima']
                                    }
                                }
                            ]
                        }
                    },
                ]
            };

            const result = await Barang.findOne(query);
            return result;
        } catch (error) {
            throw error;
        }
    },

    fetchHistoryIteBarang: async (req, idBarang) => {
        try {
            
        } catch (error) {
            throw error
        }
    }
}

/**
 * const found = await Barang.findAll({
                where: {
                    id: idBarang,
                    userId: req.currentUser,
                },
                attributes: ['name'],
                include: [
                    {
                        model: Histories,
                        attributes: ['quantityItem', 'updatedAt', 'status'],
                        include: [
                            {
                                model: Report,
                                where: {
                                    status: {[Op.not]: null}
                                },
                                attributes: ['typeReport', 'BCDocumentType', 'id', 'jenisPemberitahuan'],
                                include: [
                                    {
                                        model: reportIdentitasPenerima,
                                        attributes: ['namaPenerima']
                                    },
                                    {
                                        model: reportListDokumen,
                                        attributes: ['nomorDokumen']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
 */