const {
    validationDataPengajuan, 
    validationIdentitasPengirim, 
    validationIdentitasPenerima,
    validationTransaksiPerdagangan
} = require('../../middlewares/validationReportInput');
const {
    dataPengajuan,
    IdentitasPenerima,
    IdentitasPengirim,
    TransaksiPerdagangan,
    idReport
} = require('../../helper/bundleDataReportHeader');
const { errorResponse, successResponse } = require('../../helper/Response');
const { validationResponse } = require('../../middlewares/validationResponse');
const { updateDataPengajuan } = require('../../helper/DataPengajuan');
const { updateReportIdentitasPengirim } = require('../../helper/IdentitasPengirim');
const { updateReportIdentitasPenerima } = require('../../helper/IdentitasPenerima');
const { updateReportTransaksiPerdagangan } = require('../../helper/TransaksiPerdagangan')
const Http = require('../../helper/Httplib');
const sequelize = require('../../configs/database');

const updateDataHeader = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const {DataToInput: {Pengajuan, IdentitasPengirim, IdentitasPenerima, TransaksiPerdagangan, dataSearchReport}} = req;
        const {dataPengajuanId, identitasPengirimId, identitasPenerimaId, TransaksiPerdaganganId } = dataSearchReport;
        
        const dataPengajuanUpdate = await updateDataPengajuan(Pengajuan, dataPengajuanId, false, transaction);
        const IdentitasPengirimUpdate = await updateReportIdentitasPengirim(IdentitasPengirim, identitasPengirimId, false, transaction);
        const IdentitasPenerimaUpdate = await updateReportIdentitasPenerima(IdentitasPenerima, identitasPenerimaId, false, transaction);
        const TransaksiPerdaganganUpdate = await updateReportTransaksiPerdagangan(TransaksiPerdagangan, TransaksiPerdaganganId, false, transaction);
        
        await transaction.commit();
        return successResponse(res, Http.created, "Success Updating Report");
    } catch (error) {
        await transaction.rollback();
        
        return errorResponse(res, Http.internalServerError, "Failed To Edit The Report", error);
    }
}

module.exports = (routes) => {
    routes.put(
        '/DataHeader/:id',
        validationDataPengajuan, 
        validationIdentitasPengirim, 
        validationIdentitasPenerima,
        validationTransaksiPerdagangan,
        validationResponse,
        dataPengajuan,
        IdentitasPengirim,
        IdentitasPenerima,
        TransaksiPerdagangan,
        idReport,
        updateDataHeader
    );
}