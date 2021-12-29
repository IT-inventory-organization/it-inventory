const dataKapal = require('../../database/models/data_kapal');
const dokumenPemasukan = require('../../database/models/dokumen_pemasukan');
const dokumenPengeluaran = require('../../database/models/dokumen_pengeluaran');
const Report = require('../../database/models/report');
const tempatPenimbunan = require('../../database/models/tempat_penimbunan');
const { ServerFault, NotFoundException } = require('../../middlewares/errHandler');

const listDashboard = async(limit, offset, additionalQuery = {}) => {
    limit = limit || 10;
    offset = offset || 0;
    try {
        const query = {
            where: {
                isDelete: false,
                ...additionalQuery
            },
            attributes: ['id'],
            include: [
                {
                    model: dataKapal,
                    attributes: ['voyageKapal', 'namaKapal', 'benderaKapal'],
                    required: true
                },
                {
                    model: dokumenPemasukan,
                    attributes: ['reportId'],
                    required: true
                },
                {
                    model: tempatPenimbunan,
                    attributes: ['reportId'],
                    where: {
                        isTempatPenimbunan: true
                    }
                },
            ]
        }


        const data = await Report.findAndCountAll(query);
        return data;
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