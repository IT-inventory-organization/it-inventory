const Histories = require("../../database/models/history");
const reportListBarang = require("../../database/models/listbarang");
const Report = require("../../database/models/report");
const Barang = require("../../database/models/barang");

module.exports = {
    insertHistory: async(data, transaction) => {
        try {
            const result = await Histories.create(data,{
                transaction: transaction
            });

            return result;
        } catch (error) {
            throw error
        }
    },
    getHistoryBarangPerItem: async(req, idBarang) => {
        try {
            let query = {};
            query = {
                where: {
                    id: idBarang
                },
                include: [
                    {
                        model: Report,
                        where: {
                            userId: req.currentUser
                        }
                    },
                    {
                        model: Barang,
                        where: {
                            userid: req.currentUser
                        },
                        include: [
                            {
                                model: reportListBarang
                            }
                        ]
                    }
                ]
            }
            const result = await Histories.findAll(query);
            return result;
        } catch (error) {
            throw error;
        }
    }
}