const TempatPenimbunan = require("../../database/models/tempat_penimbunan");
const { ConflictCreateData, ForeignKeyViolation, ServerFault } = require("../../middlewares/errHandler");
const { convertStrignToDateUTC } = require("../convert");
const { isExist } = require("../checkExistingDataFromTable");
const Report = require("../../database/models/report");
const DataKapal = require("../../database/models/data_kapal");

const convert = (data) => {
    data.perkiraanTanggalPengeluaran = convertStrignToDateUTC(data.perkiraanTanggalPengeluaran)
}

const getTempatPenimbunan = async (reportId) => {
    return TempatPenimbunan.findOne({ where: { reportId: reportId } });
}

const getTempatPenimbunanAllThatTrueRepo = async(req) => {
    try {
        return TempatPenimbunan.findAll({
            include: [
                {
                    model: Report,
                    attributes: ['id'],
                    required: true,
                    include: [
                        {
                            model: DataKapal,
                            required: true,
                            attributes: ['id']
                        }
                    ]
                }
            ],
            logging: console.log,
            attributes: ['tempatPenimbunan', 'perkiraanTanggalPengeluaran'],
            where: {
                isTempatPenimbunan: true
            }
        })

    } catch (error) {
        throw new ServerFault('Terjadi Kesalahan Pada Server', error, req)
    }
}

const saveTempatPenimbunan = async(data, transaction) => {
    try {
        convert(data);
        
        return TempatPenimbunan.create(data, {
            transaction,
            returning: true
        });;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else{
            throw new ConflictCreateData("Gagal Menyimpan Data", error);
        }
    }
}

const updateTempatPenimbunanRepo = async(data, reportId, transaction) => {
    try {

        const query = {
            where: {
                id: data.id,
                reportId
            }
        }

        await isExist(TempatPenimbunan, query)

        const result = await TempatPenimbunan.update(data, {
            ...query,
            transaction,
            returning: true,
            plain: true
        })

        return result[1].toJSON();
    } catch (error) {

        if(error.name == 'SequelizeValidationError'){
            throw new ForeignKeyViolation("Terjadi Kesalahan Pada Server", error);
        }else if(error.name == "ServerFault" || error.name == 'NotFoundException'){
            throw error
        } else {
            throw new ConflictCreateData("Gagal Mengubah Data", error);
        }
    }
}

module.exports = {
    saveTempatPenimbunan,
    updateTempatPenimbunanRepo,
    getTempatPenimbunan,
    getTempatPenimbunanAllThatTrueRepo
}