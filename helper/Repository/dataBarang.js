const { Op } = require('sequelize');
const dataBarang = require('../../database/models/data_barang');
const DataKapal = require('../../database/models/data_kapal');
const Report = require('../../database/models/report');
const { ForeignKeyViolation, ConflictCreateData } = require('../../middlewares/errHandler');
const { returnError } = require('../../middlewares/errHandler');

const getDataBarang = async (reportId) => {
    return dataBarang.findAll({ where: { reportId: reportId } });
}

const saveDataBarang = async(data, transaction) => {
    try { 
        return dataBarang.create(data, {
            transaction 
        });
    } catch (error) {
        if(error.name == "SequelizeValidationError"){
            throw new ForeignKeyViolation('Terjadi Kesalahan Pada Server', error)
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error)
        }
    }
}

const fetchBarangAfterChoosingKapalPenjual = async (req, idKapal, idUser) => {
    try {
        const query = {
            include: [
                {
                    model: Report,
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: DataKapal,
                            required: true,
                            attributes: [],
                            where: {
                                id: idKapal
                            }
                        }
                    ]
                }
            ],
            attributes:['id', 'kodeBarang', 'uraian', 'satuanKemasan'],
        }

        const fetched = await dataBarang.findAll(query);
        if(!fetched){
            throw new NotFoundException('Data Barang Pada Kapal Tidak Di Temukan');
        }
        
        return fetched;
    } catch (error) {
        returnError(error, "Gagal Memproses Data Kapal Penjual");
    }
}
module.exports = {
    saveDataBarang,
    getDataBarang,
    fetchBarangAfterChoosingKapalPenjual
}