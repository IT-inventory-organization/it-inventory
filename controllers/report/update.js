const {
  validationDataPengajuan,
  validationIdentitasPengirim,
  validationIdentitasPenerima,
  validationTransaksiPerdagangan,
  validationDataPengangkutan,
  validationDataPelabuhanMuatBongkar,
  validationBeratDanVolume,
  validationDataPetiKemasDanPengemas,
  validationDataPerkiraanTanggalPengeluaran,
  validationDataTempatPenimbunan,
  validationDataLartas,
  validationPPJK,
} = require("../../middlewares/validationDataHeader");
const {
  dataPengajuan,
  identitasPenerima,
  identitasPengirim,
  transaksiPerdagangan,
  dataPengangkut,
  dataPelabuhanMuatBongkar,
  beratDanVolume,
  dataPetiKemasDanPengemas,
  dataPerkiraanTanggalPengeluaran,
  dataTempatPenimbunan,
  idReport,
  dataLartas,
  ppjk,
} = require("../../helper/bundleDataReportHeader");
const { errorResponse, successResponse } = require("../../helper/Response");
const { validationResponse } = require("../../middlewares/validationResponse");
const { updateDataPengajuan } = require("../../helper/DataPengajuan");
const {
  updateReportIdentitasPengirim,
} = require("../../helper/IdentitasPengirim");
const {
  updateReportIdentitasPenerima,
} = require("../../helper/IdentitasPenerima");
const {
  updateReportTransaksiPerdagangan,
} = require("../../helper/TransaksiPerdagangan");
const { updateDataPengangkutan } = require("../../helper/DataPengangkutan");
const {
  updateDataPelabuhanMuatBongkar,
} = require("../../helper/DataPelabuhanMuatBongkar");
const { updateDataBeratDanVolume } = require("../../helper/DataBeratDanVolume");
const {
  updateDataPetiKemasDanPengemas,
} = require("../../helper/DataPetiKemasDanPengemas");
const {
  updateDataTempatPenimbunan,
} = require("../../helper/DataTempatPenimbunan");
const {
  updatePerkiraanTanggalPengeluaran,
} = require("../../helper/DataPerkiraanTanggalPengeluaran");
const {
  createListBarang,
  fullDelete,
  updateListBarang,
  softDeleteListBarang,
} = require("../../helper/ListBarang");
const {
  softDeleteListDokumen,
  createListDokumen,
} = require("../../helper/ListDokumen");
const { updateDataPetiKemas } = require("../../helper/DataPetiKemas");
const { BDataBarang } = require("../../helper/bundleDataBarang");
const { dataDokumen, petiKemas } = require("../../helper/bundleDataLanjutan");
const {
  validationArrListDokumen,
  validationPetiKemas,
} = require("../../middlewares/validationDataLanjutan");
const { VListBarang } = require("../../middlewares/validationDataBarang");
const Http = require("../../helper/Httplib");
const sequelize = require("../../configs/database");
const authentication = require("../../middlewares/authentication");
const { createUserActivity } = require("../../helper/UserActivity");
const {
  updateReport,
  updateStatus,
  checkAuthorization,
  getOneSpecificReport,
  getOneReport,
} = require("../../helper/DataReport");
const validationReport = require("../../middlewares/validationDataReport");
const { bundleReport } = require("../../helper/bundleReport");
const { updateDataLartas } = require("../../helper/DataLartas");
const { updateStockItem, softDeleteListItem } = require("../../helper/Barang");
const { insertHistory } = require("../../helper/Histories");
const { isExist } = require("../../helper/checkExistingDataFromTable");
const Report = require("../../database/models/report");
const { updatePPJK } = require("../../helper/PPJK");
const {
  insertHistoryBarang,
  removeHistories,
} = require("../../helper/Histories/barang");
const {
  InfoReport,
  Description,
  StatsItem,
  ActivityUser,
} = require("../../helper/Activity.interface");

const updateDataHeader = async (req, res) => {
  let transaction;
  try {
    const { id } = req.params;
    transaction = await sequelize.transaction();

    const {
      DataToInput: {
        dataPengajuan,
        identitasPPJK,
        identitasPengirim,
        identitasPenerima,
        transaksiPerdagangan,
        dataPengangkutan,
        dataPelabuhanMuatBongkar,
        dataBeratDanVolume,
        dataPetiKemasDanPengemas,
        dataLartas,
        dataTempatPenimbunan,
        dataPerkiraanTanggalPengeluaran,
        dataSearchReport,
      },
    } = req.body;

    await checkAuthorization(req, id, transaction);

    // const { dataPengajuanId, identitasPenerimaId, identitasPengirimId, transaksiPerdaganganId, pengangkutanId, pelabuhanMuatBongkarId, beratDanVolumeId, petiKemasDanPengemasId, dataLartasId, tempatPenimbunanId, perkiraanTanggalId } = dataSearchReport;

    // return;
    const dataPengajuanUpdate = await updateDataPengajuan(
      dataPengajuan,
      id,
      false,
      transaction
    );
    const identitasPengirimUpdate = await updateReportIdentitasPengirim(
      identitasPengirim,
      id,
      false,
      transaction
    );
    const ppjkUpdate = await updatePPJK(identitasPPJK, id, false, transaction);
    const identitasPenerimaUpdate = await updateReportIdentitasPenerima(
      identitasPenerima,
      id,
      false,
      transaction
    );
    const transaksiPerdaganganUpdate = await updateReportTransaksiPerdagangan(
      transaksiPerdagangan,
      id,
      false,
      transaction
    );

    const dataPengangkutanUpdate = await updateDataPengangkutan(
      dataPengangkutan,
      id,
      false,
      transaction
    ); // Success
    const pelabuhanMuatBongkarUpdate = await updateDataPelabuhanMuatBongkar(
      dataPelabuhanMuatBongkar,
      id,
      false,
      transaction
    );
    const beratDanVolumeUpdate = await updateDataBeratDanVolume(
      dataBeratDanVolume,
      id,
      false,
      transaction
    );
    const petiKemasDanPengemasUpdate = await updateDataPetiKemasDanPengemas(
      dataPetiKemasDanPengemas,
      id,
      false,
      transaction
    );

    const tempatPenimbunanUpdate = await updateDataTempatPenimbunan(
      dataTempatPenimbunan,
      id,
      false,
      transaction
    );
    const perkiraanTanggalPengeluaranUpdate =
      await updatePerkiraanTanggalPengeluaran(
        dataPerkiraanTanggalPengeluaran,
        id,
        true,
        transaction
      );

    if (req.currentRole !== "Owner") {
      await createUserActivity(
        req.currentUser,
        id,
        `Updating "Data Header" Report`
      );
    }

    await transaction.commit();
    return successResponse(
      res,
      Http.created,
      "Success Updating Report",
      perkiraanTanggalPengeluaranUpdate
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    return errorResponse(
      res,
      Http.internalServerError,
      "Failed To Update Report"
    );
  }
};

const updateDataLanjutan = async (req, res) => {
  const { idReport } = req.params;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const {
      DataToInput: { dataDokumen, dataPetiKemas },
    } = req.body;

    await softDeleteListDokumen(idReport, req, transaction);
    const promises = [];

    for (let i = 0; i < dataDokumen.length; i++) {
      const element = dataDokumen[i];
      if (element.id) {
        delete element.id;
      }
      promises.push(await createListDokumen(element, transaction));
    }

    const petiKemasResult = await updateDataPetiKemas(
      dataPetiKemas,
      idReport,
      false,
      transaction
    );

    if (req.currentRole !== "Owner") {
      await createUserActivity(
        req.currentUser,
        idReport,
        `Updating "Data Lanjutan" Report`
      );
    }
    await transaction.commit();

    return successResponse(res, Http.created, "Success Updating Peti Kemas", {
      listDokumen: promises.map((el) => el.id),
      petiKemasResult: petiKemasResult.id,
      reportId: promises[0].reportId,
    });
  } catch (error) {
    await transaction.rollback();
    return errorResponse(res, Http.internalServerError, error.message);
  }
};

const updateDataBarang = async (req, res) => {
  let transaction;
  const { idReport } = req.params;

  try {
    const {
      DataToInput: { listDataBarang },
    } = req.body;

    const found = await getOneSpecificReport(req, idReport);

    if (!found) {
      return errorResponse(res, Http.badRequest, "Report Not Found");
    }

    const ReportInfo = found.toJSON().jenisPemberitahuan;

    transaction = await sequelize.transaction();

    const exception = [];

    const desc =
      ReportInfo === InfoReport.IN ? Description.ADD : Description.MINUS;
    const stats = ReportInfo === InfoReport.IN ? StatsItem.INC : StatsItem.DEC;
    const type =
      ReportInfo === InfoReport.IN
        ? ActivityUser.PPFTZ_IN
        : ActivityUser.PPFTZ_OUT;

    await removeHistories(
      req,
      res,
      {
        sourceId: idReport,
        sourceType: type,
      },
      transaction
    );

    /**
     * 1. Membuat Baru
     */
    for (let i = 0; i < listDataBarang.length; i++) {
      // if (listDataBarang[i].id || typeof listDataBarang[i].id !== "undefined") {
      //   delete listDataBarang[i].id;
      // }
      if (listDataBarang[i].id) {
        continue;
      }

      const result = await createListBarang(
        listDataBarang[i],
        transaction,
        idReport
      );

      if (result.error) {
        return errorResponse(res, Http.badRequest, result.error);
      }

      await insertHistoryBarang(
        req,
        res,
        {
          idBarang: listDataBarang[i].idBarang,
          desc: desc,
          quantityItem: listDataBarang[i].quantity,
          status: stats,
          sourceId: idReport,
          sourceType: type,
          userId: req.currentUser,
        },
        transaction
      );

      exception.push(result.id);
    }
    /**
     * 2. Update
     */
    for (const iterator of listDataBarang) {
      if (iterator.id !== "") {
        continue;
      }
      const { id, ...restOfData } = iterator;
      const result = await updateListBarang(
        restOfData,
        iterator,
        true,
        transaction
      );

      await insertHistoryBarang(
        req,
        res,
        {
          idBarang: iterator.idBarang,
          desc: desc,
          quantityItem: iterator.quantity,
          status: stats,
          sourceId: idReport,
          sourceType: type,
          userId: req.currentUser,
        },
        transaction
      );

      exception.push(result[1][0].toJSON().id);
    }

    await softDeleteListBarang(idReport, req, transaction, exception);

    const dataToReturn = {
      listDataBarang: exception,
    };

    await createUserActivity(
      req.currentUser,
      idReport,
      `Updating "Data Barang" Report`
    );

    await transaction.commit();
    return successResponse(
      res,
      Http.created,
      "Success Update Item",
      dataToReturn
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    return errorResponse(res, Http.internalServerError, error.message);
  }
};

const checkStatus = (val, status) => {
  let stats = ``;

  switch (true) {
    case /(hijau)/.test(status):
      if (/(export)/gi.test(val)) {
        stats = `decrease`;
      } else if (/(import)/gi.test(val)) {
        stats = `increase`;
      }
      break;
    case /(merah)/.test(status):
      break;
    default:
      break;
  }
  return stats;
};

const updateStatusInvetory = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let transaction;
  try {
    if (req.currentRole !== "Admin") {
      throw new Error(`${req.currentRole} Cannot Updating Status`);
    }

    transaction = await sequelize.transaction();

    const result = await getOneReport(req, id);

    if (/(hijau)/gi.test(status)) {
      const { listBarangs, jenisPemberitahuan } = result;

      for (let i = 0; i < listBarangs.length; i++) {
        const { idBarang, quantity } = listBarangs[i].toJSON();

        // Mengubah Nilai
        await updateStockItem(
          req,
          idBarang,
          null,
          quantity,
          jenisPemberitahuan,
          transaction
        );

        const data = {
          idBarang: +idBarang,
          reportId: +id,
          quantityItem: +quantity,
          status: checkStatus(jenisPemberitahuan, status),
        };

        // Menyimpan Catatan
        await insertHistory(data, transaction);
      }
    }

    await updateStatus(id, status, transaction);

    if (req.currentRole !== "Owner") {
      await createUserActivity(req.currentUser, id, `Updating Status Report`);
    }
    await transaction.commit();
    return successResponse(res, Http.created, "Success Updating Status");
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    return errorResponse(res, Http.internalServerError, error.message);
  }
};

const updateReportPerId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await updateReport(id, req.body.DataToInput, req);

    if (req.currentRole !== "Owner") {
      await createUserActivity(req.currentUser, id, `Updating Report`);
    }

    return successResponse(res, Http.created, "Success Update Report");
  } catch (error) {
    return errorResponse(res, Http.internalServerError, error.message);
  }
};

module.exports = (routes) => {
  routes.put(
    "/:id",
    authentication,
    bundleReport,
    validationReport,
    validationResponse,
    updateReportPerId
  );

  routes.put(
    "/data-header/:id",
    authentication,
    dataPengajuan,
    identitasPengirim,
    ppjk,
    identitasPenerima,
    transaksiPerdagangan,
    dataPengangkut,
    dataPelabuhanMuatBongkar,
    beratDanVolume,
    dataPetiKemasDanPengemas,
    dataPerkiraanTanggalPengeluaran,
    dataTempatPenimbunan,

    idReport,
    validationDataPengajuan,
    validationPPJK,
    validationIdentitasPengirim,
    validationIdentitasPenerima,
    validationTransaksiPerdagangan,
    validationDataPengangkutan,
    validationDataPelabuhanMuatBongkar,
    validationBeratDanVolume,
    validationDataPetiKemasDanPengemas,
    validationDataPerkiraanTanggalPengeluaran,
    validationDataTempatPenimbunan,

    validationResponse,
    updateDataHeader
  );

  routes.put(
    "/data-barang/:idReport",
    authentication,
    BDataBarang,
    VListBarang,
    validationResponse,
    updateDataBarang
  );

  routes.put(
    "/data-lanjutan/:idReport",
    authentication,
    dataDokumen,
    petiKemas,
    validationArrListDokumen,
    validationPetiKemas,
    validationResponse,
    updateDataLanjutan
  );

  routes.put("/updateStatus/:id", authentication, updateStatusInvetory);
};
