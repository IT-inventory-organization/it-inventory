const { Op } = require("sequelize");
const sequelize = require("../../configs/database");
const barangPO = require("../../database/models/barang_po")
const bcf3315 = require("../../database/models/bcf3315")
const dataBarang = require("../../database/models/data_barang");
const DataKapal = require("../../database/models/data_kapal");
const DataPengangkutan = require("../../database/models/data_pengangkutan");
const DokumenPemasukan = require("../../database/models/dokumen_pemasukan");
const infoPengguna = require("../../database/models/info_pengguna")
const po = require("../../database/models/po")
const Report = require("../../database/models/report");
const { ServerFault } = require("../../middlewares/errHandler");
const STATUS = require("../Status.const")

const getBcf3315ThatAlreadyBeenAcceptByBeaCukai = async(req, idUser) => {
    try {
        console.log(idUser);
        return bcf3315.findAll({
            include: [
                {
                    model: po,
                    attributes: [],
                    required: true,
                    where: {
                        reportId: {
                            [Op.not]: null
                        },
                        userId: idUser
                    },
                }
            ],
            where: {
                nomorbcf3314: {
                    [Op.not]: null
                },
                status: STATUS.DISETUJUI
            },
            logging: console.log,
            attributes: [
               [
                    sequelize.fn('CONCAT', 
                    'BCF 3.3.14-',
                    sequelize.col('nomorbcf3314')
                    ),'bcf'
                ],
                'id'
            ],
            raw: false,
        });
    } catch (error) {
        throw new ServerFault('Terjadi Kesalahan Pada Server', error, req);
    }
}

const fetchBCF3315PerId = async(req, idUser, idBCF) => {
    try {
        const data = await bcf3315.findOne({
            include: [
                {
                    model: infoPengguna,
                    required: true,
                    attributes: ['namaPemilik', 'nip']
                },
                {
                    model: po,
                    required: true,
                    include: [
                        {
                            model: barangPO,
                            required: true,
                            attributes: [['jumlah', 'perkiraanJumlah'], ['hargaSatuan', 'satuan']],
                            include: [
                                {
                                    model: dataBarang,
                                    required: true,
                                    attributes: [['kodeBarang', 'hsCode'], ['uraian', 'jenisBarang']]
                                }
                            ]
                        }
                    ],
                    attributes: []
                }
            ],
            where: {
                id: idBCF
            },
            logging: console.log,
            attributes: [
                'npwp',
                'nama',
                'alamat',
                'lokasiPLB',
                'caraPengangkutan',
                'pelabuhanMuat',
                'tanggalPerkiraan',
                'namaPengangkutKeLuar',
                'voyage',
                'callSign',

            ],
        });
        console.log(data);
        return data; 
    } catch (error) {
        console.log(error)
        // throw new ServerFault("Terjadi Kesalahan Pada Server", error, req)
    }
}


module.exports = {
    getBcf3315ThatAlreadyBeenAcceptByBeaCukai,
    fetchBCF3315PerId,
}