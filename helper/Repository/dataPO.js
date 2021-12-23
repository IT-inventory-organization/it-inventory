const { Op } = require('sequelize');
const barangPO = require('../../database/models/barang_po');
const bcf3315 = require('../../database/models/bcf3315');
const dataBarang = require('../../database/models/data_barang');
const DataKapal = require('../../database/models/data_kapal');
const dataPO = require('../../database/models/po');
const Report = require('../../database/models/report');
const { ForeignKeyViolation, ConflictCreateData, ServerFault } = require('../../middlewares/errHandler');
const { isExist } = require("../checkExistingDataFromTable");

const saveDataPO = async(data, transaction) => {
    try {
        return dataPO.create(data, {
            transaction,
            returning: true
        });
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server', error)
        }else if(error.name == "SequelizeDatabaseError"){
            throw new ServerFault('Terjadi Kesalahan Pada Server', error);
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error)
        }
    }
}

const updateDataPO = async(data, query, transaction) => {
    try {
        await isExist(dataPO, query);
        const result = await dataPO.update(data, {
            ...query,
            transaction,
            returning: true,
            // plain: true
        })

        return result[1];
    } catch (error) {
        if (error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server");
        } else if (error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data");
        }
    }
}

const getAllPurchaseOrder= async (req, idUser) => {
    try {
            const query = {
                include: [
                    {
                        model: barangPO,
                        required: true,
                        attributes: []
                    },
                ],
                order: [
                    ['createdAt', 'desc'],
                    ['updatedAt', 'desc'],
                ],
                where: {
                    reportId: {
                        [Op.not]: null 
                    },
                    nomorPO: {
                        [Op.not]: null
                    }, 
                    userId: idUser,
                    isDelete: false
                },

                attributes: ['nomorPO', 'tanggalPurchaseOrder', 'kapalPenjual', 'id', 'createdAt']
            }
            
            return dataPO.findAndCountAll(query); 
   
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const getAllPurchaseOrderForBCF3315 = async (req, idUser) => {
    try {
        const query = {
            include: [
                {
                    model: bcf3315,
                    attributes: ['id'],
                },
                {
                    model: Report,
                    attributes: [],
                    where: {
                        userId: idUser
                    }
                }
            ],
            where: {
                nomorPO: {
                    [Op.ne]: null
                }
            },
            attributes: ['nomorPO', 'id'],
            plain:false,
        }

        const result = await dataPO.findAll(query);
        for (let i = 0; i < result.length; i++) {
            const element = result[i].toJSON();
            if(element.bcf3315){
                delete result[i];
            }
            
        }
        return result
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getBarangForBCF3315AfterChoosingNumberPurchaseOrder = async(req, idUser, idPO) => {
    try {
        const query = {
            include: [
                {
                    model: barangPO,
                    attributes: [['satuanKemasan', 'satuan',], ['jumlah', 'perkiraanJumlah']],
                    required: true,
                    where: {
                        poId: idPO
                    }
                },
                {
                    model: Report,
                    attributes: [],
                    required: true,
                    where: {
                        userId: idUser
                    },
                    include: [
                        {
                            model: dataPO,
                            required: true,
                            attributes:[]
                        }
                    ]
                }
            ],
            logging: console.log,
            attributes: [['kodeBarang', 'hsCode'], ['uraian', 'jenis']],
            // raw: true
        }; 

        
        return await dataBarang.findAll(query);
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const viewOnePo = async(req, idUser, idPO) => {
    try {
        const query = {
            include: [
                {
                    model: barangPO,
                    required: true,
                    attributes: {
                        exclude: ['id', 'createdAt', 'updatedAt', 'idBarang']
                    }
                },
            ],
            where: {
                id: idPO,
                isDelete: {
                    [Op.ne]: null
                },
                userId: idUser
            },
            attributes: {
                exclude: ['id', 'createdAt', 'updatedAt', 'reportId']
            },
            plain:true
        }

        
        return await dataPO.findOne(query);
    } catch (error) {
        console.log(error)
        throw error
    }
}

const checkPurchaseOrderExistance = async (nomorPo) => {
    return dataPO.findOne({
        where: {
            nomorPO: nomorPo,
            isDelete: false
        } 
    })
}

const deletePurchaseOrderPerId = async(req, idUser, idPO) => {
    try {
        await isExist(dataPO, {
            where: {
                id: idPO
            }
        });

        await dataPO.update({
            isDelete: true
        },{
            where: {
                id: idPO
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    saveDataPO,
    updateDataPO,
    getAllPurchaseOrder,
    viewOnePo,
    deletePurchaseOrderPerId,
    checkPurchaseOrderExistance,
    getAllPurchaseOrderForBCF3315,
    getBarangForBCF3315AfterChoosingNumberPurchaseOrder
}