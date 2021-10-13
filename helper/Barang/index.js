const Barang = require('../../database/models/barang');
const reportListBarang = require('../../database/models/listbarang');
const { authUser } = require('../../helper/authBarang');
const sequelize = require('../../configs/database');

const findBarang = async (id, idUser) => {
    return await Barang.findOne({
        where: {
            id: id,
            userId: idUser
        }
    });
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
            const findItem = await findBarang(id, req,currentUser);
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
            throw error;
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
                if(!await authUser(listItem, id, req, true)){
                    throw new Error(`User is Not Authorized To Access Data`)
                }
                user+=`AND barang."userId" = ${req.currentUser} AND barang.id = ${id}`;
            }else{
                user+=`AND barang."userId" = ${req.currentUser}`;
            }

            if(search){
                const column = ['posTarif', 'hsCode', 'uraian', 'satuanKemasan', 'nettoBrutoVolume', 'quantity', 'nilaiPabeanHargaPenyerahan'];
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
                if(!await authUser(listItem, id, req, true)){
                    throw new Error(`User Is Not Authorized to Access Data`)
                }

                let sql = `SELECT barang.uraian, barang."posTarif", barang."hsCode", barang."nettoBrutoVolume", barang."satuanKemasan", barang."nilaiPabeanHargaPenyerahan", (barang.quantity - SUM("lB".quantity)) as total, SUM("lB".quantity) FROM "Barang" AS barang LEFT OUTER JOIN "listBarang" AS "lB" ON (barang.id = "lB"."idBarang") WHERE barang."isDelete" = false ${user} GROUP BY barang."posTarif", barang."hsCode", barang."nettoBrutoVolume", barang."satuanKemasan", barang."nilaiPabeanHargaPenyerahan", barang.quantity, barang.uraian`;

                const result = await sequelize.query(sql);
                return result[0]
            }else{
                

                let sql = `SELECT barang.uraian, barang."posTarif", barang."hsCode", barang."nettoBrutoVolume", barang."satuanKemasan", barang."nilaiPabeanHargaPenyerahan", (barang.quantity - SUM("lB".quantity)) as total, SUM("lB".quantity) FROM "Barang" AS barang LEFT OUTER JOIN "listBarang" AS "lB" ON (barang.id = "lB"."idBarang") WHERE barang."isDelete" = false ${user} ${searchQuery} GROUP BY barang."posTarif", barang."hsCode", barang."nettoBrutoVolume", barang."satuanKemasan", barang."nilaiPabeanHargaPenyerahan", barang.quantity, barang.uraian LIMIT ${limit} OFFSET ${offset}`

                console.log(sql);

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

    updateStockItem: async (req, id, status, total) => {
        if(! await authUser(Barang, id, req, true)){
            throw new Error(`User is not authorized to update`);
        }

        const resultFindItem = await findBarang(id, req.currentUser)


        if(!resultFindItem){
            throw new Error(`Data Not Found`);
        }

        let quantity = resultFindItem.quantity;
        
        if((/(increase)/gi).test(status)){
            quantity+=total;
        }else if((/(decrease)/gi).test(status)){
            if(quantity <= 0){
                throw new Error(`Stock ${resultFindItem.uraian} is Currently Empty`)
            }
            quantity-=total;
        }

        const result = await Barang.update({
            quantity: quantity,
        }, {
            where: {
                id: id,
                userId: req.currentUser
            },
            returning: true
        });

        return result;
    }
}