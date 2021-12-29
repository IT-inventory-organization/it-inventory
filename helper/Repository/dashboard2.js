const dataKapal = require('../../database/models/data_kapal');
const dokumenPemasukan = require('../../database/models/dokumen_pemasukan');
const tempatPenimbunan = require('../../database/models/tempat_penimbunan')
const dokumenPengeluaran = require('../../database/models/dokumen_pengeluaran');
const report = require('../../database/models/report');
const { ServerFault, NotFoundException } = require("../../middlewares/errHandler");
const DokumenPemasukan = require('../../database/models/dokumen_pemasukan');
const Report = require('../../database/models/report');

const getAllDashboard = async (req, idReport) => {
    try {
        const query = {
            include: [
                {
                    model: dataKapal,
                    attributes: ['voyage', 'namaKapal', 'bendera'],
                    required: true
                }
            ],
            where: {
                id: idReport
            },
            attributes: [['jenisPemberitahuan', 'jenisDokumen']], plain: false,
        }
        return await Report.findAll(query);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


module.exports = {
    getAllDashboard
}