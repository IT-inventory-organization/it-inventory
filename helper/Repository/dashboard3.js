const dataKapal = require('../../database/models/data_kapal');
const DokumenPemasukan = require('../../database/models/dokumen_pemasukan');
const DokumenPengeluaran = require('../../database/models/dokumen_pengeluaran');
const Report = require('../../database/models/report');
const tempatPenimbunan = require('../../database/models/tempat_penimbunan');
const { ServerFault } = require('../../middlewares/errHandler');

const listDashboard = async(req, idUser) => {
    try {
        const query = {
            where: {
                isDelete: false,
                userId: idUser
            },
            attributes: ['id'],
            include: [
                {
                    model: dataKapal,
                    attributes: ['voyageKapal', 'namaKapal', 'benderaKapal'],

                },
                {
                    model: DokumenPemasukan,
                    attributes: ['reportId'],
                    required: true,
                    include: [
                        {
                            model: DokumenPengeluaran
                        }
                    ]
                },
                {
                    model: tempatPenimbunan,
                    attributes: ['id'],
                    where: {
                        isTempatPenimbunan: true
                    }
                },
            ]
        }
 
        return Report.findAndCountAll(query);
    } catch (error) {
        // console.log(error)
        if (error.name == "ReferenceError") {
            throw new ServerFault("Terjadi Kesalahan Pada Server")
        } else {
            throw error
        }     
    }
}

module.exports = {
    listDashboard
}