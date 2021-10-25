const Histories = require("../../database/models/history");
const reportListBarang = require("../../database/models/listbarang");
const Report = require("../../database/models/report");
const Barang = require("../../database/models/barang");
const reportIdentitasPenerima = require("../../database/models/identitaspenerima");
const reportListDokumen = require("../../database/models/listdokumen");
const { Op } = require("sequelize");
const reportIdentitasPPJK = require("../../database/models/identitasppjk");

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
    getHistoryBarangPerItem: async(req, idBarang, noReport) => {
        try {
            let query = {};
            query = {
                where: {
                    idBarang: idBarang
                },
                attributes: [['quantityItem', 'quantity'], 'status', 'updatedAt'],
                include: [
                    {
                        model: Report,
                        attributes: ['jenisPemberitahuan', 'typeReport', 'BCDocumentType', 'nomorAjuan'],
                        where: {
                            isDelete: false,
                            userId: req.currentUser
                        },
                        include: [
                            {
                                model: reportIdentitasPPJK,
                                attributes: ['namaPPJK'],
                                // as: 'asd'
                            }
                        ],
                        required: false
                    },
                    {
                        model: Barang,
                        where: {
                            isDelete: false
                        }
                    }
                ],
                raw: true,
            }
            let result = await Histories.findAll(query);
            if(result.length){
                for(let i = 0; i < result.length; i++){
                    const res = await reportListDokumen.findOne({
                        where: {
                            reportId: result[i]['Report.nomorAjuan']
                        },
                        attributes: ['nomorDokumen']
                    });
                    
                    if(res) {
                        const found = res.toJSON();
                        result[i] = {
                            ...result[i],
                            'nomorDokumen': found.nomorDokumen
                        }
                    }
                }
            }else{
                result = [];
            }

            return result;
            
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}