const dataBarang = require("../../database/models/data_barang");
const DataKapal = require("../../database/models/data_kapal");
const DokumenPemasukan = require("../../database/models/dokumen_pemasukan");
const DokumenPengeluaran = require("../../database/models/dokumen_pengeluaran");
const Report = require("../../database/models/report");
const TempatPenimbunan = require("../../database/models/tempat_penimbunan");

const getAllInventory = async (req, idUser) => {
    try {
        const query = {
            include: [
                {
                    model: DataKapal,
                    attributes: ['id','voyageKapal', 'namaKapal', ['benderaKapal', 'bendera']],
                    // required: true,
                },
                {
                    model: dataBarang,
                    attributes: ['id','kodeBarang', 'namaBarang', ['uraian', 'itemDeskripsi'], 'satuanKemasan', ['stock', 'quantity']],
                    // required: true
                },
                {
                    model: TempatPenimbunan,
                    attributes: ['isTempatPenimbunan'],
                    where: {
                        isTempatPenimbunan: true
                    }
                },
                {
                    model: DokumenPemasukan,
                    required: true,
                    include:[
                        {
                            model: DokumenPengeluaran
                        }
                    ]
                }
            ],
            where: {
                userId: idUser,
                isDelete: false,
            },
            attributes: [['jenisPemberitahuan', 'jenisDokumen'],['id','reportId']],
            plain: false,
            // logging: console.log
        }
        
        return Report.findAll(query);
    } catch (error) {
        console.log(error)
        throw error;
    }
}


module.exports = {
    getAllInventory
}