const DataBarang = require("../../database/models/data_barang");
const DataKapal = require("../../database/models/data_kapal");
const BarangPO = require("../../database/models/barang_po");
const Report = require("../../database/models/report");
const AdjustmentBarang = require("../../database/models/adjustment_barang");
const PO = require("../../database/models/po");
const { ServerFault, NotFoundException } = require("../../middlewares/errHandler");
const sequelize = require("sequelize");

const listInventory = async(limit, offset, additionalQuery = {}) => {
    limit = limit || 10;
    offset = offset || 0;
    try {
        let arr = [];
        arr.push(
            BarangPO.findAll({
                where: {
                    ...additionalQuery
                },
                attributes: [
                    [sequelize.literal("'PO'"), 'aktifitas'],
                    [sequelize.literal('(select "po"."kapalPenjual" from "po" where "barangPO"."poId" = "po"."id")'), 'namaKapal'],
                    [sequelize.literal('(select "dataBarang"."namaBarang" from "dataBarang" where "barangPO"."idBarang" = "dataBarang"."id")'), 'namaBarang'],
                    [sequelize.literal('(select "po"."nomorPO" from "po" where "barangPO"."poId" = "po"."id")'), 'nomorDokumen'],
                    'quantity',
                    [sequelize.literal("null"), 'balance'],
                    'createdAt'
                ],
                include: [
                    // {
                    //     model: DataBarang,
                    //     attributes: ['namaBarang', 'stock'],
                    //     required: false
                    // },
                    // {
                    //     model: DataKapal,
                    //     attributes: {
                    //         exclude: ['updatedAt', 'createdAt']
                    //     },
                    //     required: false
                    // }
                ],
                order: [
                    ['createdAt', 'desc']
                ]
                // limit: limit,
                // offset: offset
            })
        );
        arr.push(
            AdjustmentBarang.findAll({
                where: {
                    ...additionalQuery
                },
                attributes: [
                    [sequelize.literal("'Adjustment'"), 'aktifitas'],
                    [sequelize.literal("null"), 'namaKapal'],
                    [sequelize.literal('(select "dataBarang"."namaBarang" from "dataBarang" where "adjustmentBarang"."dataBarangId" = "dataBarang"."id")'), 'namaBarang'],
                    ['nomorAdjustment', 'nomorDokumen'],
                    'quantity',
                    [sequelize.literal("null"), 'balance'],
                    'createdAt'
                ],
                order: [
                    ['createdAt', 'desc']
                ]
                // limit: limit,
                // offset: offset
            })
        );

        const data = await Promise.all(arr).then((modelReturn) => modelReturn.flat());
        // if (!data) throw new NotFoundException("Data Tidak Ditemukan");

        return data;
    } catch (error) {
        console.log(error)
        if (error.name == "ReferenceError") {
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        } else {
            throw error
        }
        
    }
}

const listPemasukan = async(limit, offset, additionalQuery = {}) => {
    limit = limit || 10;
    offset = offset || 0;
    try {
        let arr = [];
        arr.push(
            Report.findAndCountAll({
                where: {
                    jenisPemberitahuan: 'Pemasukan',
                    ...additionalQuery
                },
                attributes: [
                    'id',
                    ['createdAt', 'tanggal'],
                    'jenisPemberitahuan',
                    'jenisDokumenBC',
                    [
                        sequelize.literal(`(
                            select "dokumenPemasukan"."nomorDokumenPemasukan" from "dokumenPemasukan"
                            where "dokumenPemasukan"."reportId" = "report"."id")`),
                        'nomorDokumen'
                    ],
                    [
                        sequelize.literal(`(
                            select "dataKapal"."voyageKapal" from "dataKapal"
                            where "dataKapal"."reportId" = "report"."id")`),
                        'voyageKapal'
                    ],
                    [
                        sequelize.literal(`(
                            select "dataKapal"."namaKapal" from "dataKapal"
                            where "dataKapal"."reportId" = "report"."id")`),
                        'namaKapal'
                    ],
                    [
                        sequelize.literal(`(
                            select "dataKapal"."benderaKapal" from "dataKapal"
                            where "dataKapal"."reportId" = "report"."id")`),
                        'benderaKapal'
                    ],
                ],
                include: [
                    {
                        model: DataBarang,
                        attributes: ['kodeBarang', 'namaBarang', 'uraian', 'satuanKemasan', 'stock'],
                        required: false
                    },
                ],
                order: [
                    ['createdAt', 'desc']
                ]
                // limit: limit,
                // offset: offset
            })
        );

        const data = await Promise.all(arr).then((modelReturn) => modelReturn.flat());
        // if (!data) throw new NotFoundException("Data Tidak Ditemukan");

        return data;
    } catch (error) {
        console.log(error)
        if (error.name == "ReferenceError") {
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        } else {
            throw error
        }
        
    }
}

const listPengeluaran = async(limit, offset, additionalQuery = {}) => {
    limit = limit || 10;
    offset = offset || 0;
    try {
        let arr = [];
        arr.push(
            Report.findAndCountAll({
                where: {
                    jenisPemberitahuan: 'Pengeluaran',
                    ...additionalQuery
                },
                attributes: [
                    'id',
                    ['createdAt', 'tanggal'],
                    'jenisPemberitahuan',
                    'jenisDokumenBC',
                    [
                        sequelize.literal(`(
                            select "dokumenPengeluaran"."nomorDokumen" from "dokumenPengeluaran"
                            where "dokumenPengeluaran"."reportId" = "report"."id")`),
                        'nomorDokumen'
                    ],
                    [
                        sequelize.literal(`(
                            select "dokumenPemasukan"."nomorDokumenPemasukan" from "dokumenPengeluaran"
                            left join "dokumenPemasukan" on "dokumenPengeluaran"."dokumenPemasukanId" = "dokumenPemasukan"."id"
                            where "dokumenPengeluaran"."reportId" = "report"."id")
                        `),
                        'nomorDokumenPemasukan'
                    ],
                    [
                        sequelize.literal(`(
                            select "dataKapal"."voyageKapal" from "dataKapal"
                            where "dataKapal"."reportId" = "report"."id")`),
                        'voyageKapal'
                    ],
                    [
                        sequelize.literal(`(
                            select "dataKapal"."namaKapal" from "dataKapal"
                            where "dataKapal"."reportId" = "report"."id")`),
                        'namaKapal'
                    ],
                    [
                        sequelize.literal(`(
                            select "dataKapal"."benderaKapal" from "dataKapal"
                            where "dataKapal"."reportId" = "report"."id")`),
                        'benderaKapal'
                    ],
                ],
                include: [
                    {
                        model: DataBarang,
                        attributes: ['kodeBarang', 'namaBarang', 'uraian', 'satuanKemasan', 'stock'],
                        required: false
                    },
                ],
                order: [
                    ['createdAt', 'desc']
                ]
                // limit: limit,
                // offset: offset
            })
        );

        const data = await Promise.all(arr).then((modelReturn) => modelReturn.flat());
        // if (!data) throw new NotFoundException("Data Tidak Ditemukan");

        return data;
    } catch (error) {
        console.log(error)
        if (error.name == "ReferenceError") {
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        } else {
            throw error
        }
        
    }
}

module.exports = {
    listInventory,
    listPemasukan,
    listPengeluaran
}