const { Op } = require("sequelize")
const barangPO = require("../../database/models/barang_po")
const bcf3315 = require("../../database/models/bcf3315")
const dataBarang = require("../../database/models/data_barang")
const DataPengangkutan = require("../../database/models/data_pengangkutan")
const infoPengguna = require("../../database/models/info_pengguna")
const po = require("../../database/models/po")
const Report = require("../../database/models/report")

const getBcf3315ThatAlreadyBeenAcceptByBeaCukai = async(req, idUser) => {
    try {
        return bcf3315.findAll({
            include: [
                {
                    model: po,
                    attributes: [],
                    required: true,
                    where: {
                        reportId: {
                            [Op.ne]: null
                        }
                    },
                    include: [
                        {
                            model: Report,
                            where: {
                                userId: idUser
                            },
                            attributes: [],
                        }
                    ]
                }
            ],
            where: {
                nomorbcf3314: {
                    [Op.ne]: null
                },
                status: 'diterima'
            },
            attributes: ['nomorPO'],
            // plain: false,
            // raw:true,
            // logging: console.log
        })
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const fetchBCF3315PerId = async(req, idUser) => {
    try {
        return bcf3315.findOne({
            include: [
                {
                    model: po,
                    include: [
                        {
                            model: barangPO,
                            include: [
                                {
                                    model: dataBarang,
                                    attributes: [['uraian', 'jenisBarang'], ['kodeBarang', 'hsCode'], ['hargaSatuan', 'satuan']],
                                    required: true
                                }
                            ],
                            attributes: [['jumlah', 'perkiraanJumlah']],
                            required: true
                        },
                        {
                            model: Report,
                            include: [
                                {
                                    model: infoPengguna,
                                    attributes: ['npwp', 'namaPemilik', 'alamat', ]
                                },
                                {
                                    model: DataPengangkutan,
                                    attributes: [['caraAngkut','caraPengangkutan']]
                                }
                            ],
                            attributes: ['diAjukanDiKantor'],
                        }
                    ]
                }
            ]
        })
    } catch (error) {
        
    }
}

module.exports = {
    getBcf3315ThatAlreadyBeenAcceptByBeaCukai,
    fetchBCF3315PerId
}