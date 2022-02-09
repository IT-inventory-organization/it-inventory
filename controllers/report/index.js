const Http = require("../../helper/Httplib");
const {
  createReport,
  getOneSpecificReport,
  getOneReport,
  createReportDuplicate,
} = require("../../helper/DataReport");
const { createDataPengajuan } = require("../../helper/DataPengajuan");
const {
  createReportIdentitasPenerima,
} = require("../../helper/IdentitasPenerima");
const {
  createReportIdentitasPengirim,
} = require("../../helper/IdentitasPengirim");
const {
  createReportTransaksiPerdagangan,
} = require("../../helper/TransaksiPerdagangan");
const { errorResponse, successResponse } = require("../../helper/Response");
const { validationResponse } = require("../../middlewares/validationResponse");
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
  dataLartas,
  ppjk,
} = require("../../helper/bundleDataReportHeader");

const sequelize = require("../../configs/database");
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

const validationReport = require("../../middlewares/validationDataReport");
const {
  validationArrListDokumen,
  validationPetiKemas,
} = require("../../middlewares/validationDataLanjutan");
const { BDataBarang } = require("../../helper/bundleDataBarang");
const { dataDokumen, petiKemas } = require("../../helper/bundleDataLanjutan");
const { createDataPengangkutan } = require("../../helper/DataPengangkutan");
const {
  createDataPelabuhanMuatBongkar,
} = require("../../helper/DataPelabuhanMuatBongkar");
const { createDataBeratDanVolume } = require("../../helper/DataBeratDanVolume");
const {
  createDataPetiKemasDanPengemas,
} = require("../../helper/DataPetiKemasDanPengemas");
const {
  createDataTempatPenimbunan,
} = require("../../helper/DataTempatPenimbunan");
const {
  createPerkiraanTanggalPengeluaran,
} = require("../../helper/DataPerkiraanTanggalPengeluaran");
const { createListDokumen } = require("../../helper/ListDokumen");
const { createDataPetiKemas } = require("../../helper/DataPetiKemas");
const { createListBarang } = require("../../helper/ListBarang");
const { VListBarang } = require("../../middlewares/validationDataBarang");
const authentication = require("../../middlewares/authentication");
const Encryption = require("../../helper/encription");
const {
  createUserActivity,
  CreateActivityUser,
} = require("../../helper/UserActivity");
const { bundleReport } = require("../../helper/bundleReport");
const { createDataLartas } = require("../../helper/DataLartas");
const { createPPJK } = require("../../helper/PPJK");
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

/**
 * Complete
 * @param {*} req
 * @param {*} res
 * @returns
 */
const addReport = async (req, res) => {
  try {
    const result = await createReport(req.body.DataToInput, null);

    const dataReturn = {
      id: result.id,
      userId: result.userId,
    };

    // if (req.currentRole !== "Owner") {
    //   await createUserActivity(req.currentUser, result.id, "Create New Report");
    // }

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Create Report",
        sourceId: result.id,
        sourceType: ActivityUser.PPFTZ,
        userId: req.currentUser,
      });
    }

    return successResponse(
      res,
      Http.created,
      "Success Adding A Report",
      dataReturn
    );
  } catch (error) {
    return errorResponse(
      res,
      Http.internalServerError,
      "Failed To Add A Report",
      error
    );
  }
};

// Callback Add Data Header
const addDataHeader = async (req, res) => {
  let transaction;

  try {
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
        dataTempatPenimbunan,
        dataPerkiraanTanggalPengeluaran,
      },
    } = req.body;

    const dataPengajuanResult = await createDataPengajuan(
      dataPengajuan,
      transaction
    ); // Simpan Ke Table Data Pengajuan

    const identitasPenerimaResult = await createReportIdentitasPenerima(
      identitasPenerima,
      transaction
    ); // Revision

    const ppjkResult = await createPPJK(identitasPPJK, transaction);

    const identitasPengirimResult = await createReportIdentitasPengirim(
      identitasPengirim,
      transaction
    ); // Simpan Ke Table Identitas Pengirim

    const transaksiPerdaganganResult = await createReportTransaksiPerdagangan(
      transaksiPerdagangan,
      transaction
    ); // Simpan Ke Table Transaksi

    const pengangkutanResult = await createDataPengangkutan(
      dataPengangkutan,
      transaction
    );

    const pelabuhanMuatBongkarResult = await createDataPelabuhanMuatBongkar(
      dataPelabuhanMuatBongkar,
      transaction
    );

    const beratDanVolumeResult = await createDataBeratDanVolume(
      dataBeratDanVolume,
      transaction
    );

    const petiKemasDanPengemasResult = await createDataPetiKemasDanPengemas(
      dataPetiKemasDanPengemas,
      transaction
    );

    const tempatPenimbunanResult = await createDataTempatPenimbunan(
      dataTempatPenimbunan,
      transaction
    );

    // const dataLartasResult = await createDataLartas(dataLartas, transaction);

    const perkiraanTanggalResult = await createPerkiraanTanggalPengeluaran(
      dataPerkiraanTanggalPengeluaran,
      transaction
    );

    const dataToReturn = {
      dataPengajuanId: dataPengajuanResult.id,
      ppjkId: ppjkResult.id,
      reportId: dataPengajuanResult.reportId,
      identitasPenerimaId: identitasPenerimaResult.id,
      identitasPengirimId: identitasPengirimResult.id,
      transaksiPerdaganganId: transaksiPerdaganganResult.id,
      pengangkutanId: pengangkutanResult.id,
      pelabuhanMuatBongkarId: pelabuhanMuatBongkarResult.id,
      beratDanVolumeId: beratDanVolumeResult.id,
      petiKemasDanPengemasId: petiKemasDanPengemasResult.id,
      tempatPenimbunanId: tempatPenimbunanResult.id,
      perkiraanTanggalId: perkiraanTanggalResult.id,
    };

    if (req.currentRole !== "Owner") {
      await createUserActivity(
        req.currentUser,
        dataPengajuan.reportId,
        `Create Report "Data Header"`
      );
    }

    await transaction.commit();

    return successResponse(
      res,
      Http.created,
      "Success Adding Data Header",
      dataToReturn
    );
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    return errorResponse(res, Http.internalServerError, "Failed To Add Data");
  }
};

// Callback Add Data Lanjutan
const addDataLanjutan = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const {
      DataToInput: { dataDokumen, dataPetiKemas },
    } = req.body;

    const promises = [];

    for (let i = 0; i < dataDokumen.length; i++) {
      let result = await createListDokumen(dataDokumen[i], transaction);
      promises.push(result);
    }

    const petiKemasResult = await createDataPetiKemas(
      dataPetiKemas,
      transaction
    );

    const dataToReturn = {
      dataDokumen: promises.map((el) => el.id),
      reportId: petiKemas.reportId,
      dataPetiKemas: petiKemasResult.id,
    };

    if (req.currentRole !== "Owner") {
      await createUserActivity(
        req.currentUser,
        dataPetiKemas.reportId,
        `Create Report "Data Lanjutan"`
      );
    }

    await transaction.commit();

    return successResponse(
      res,
      Http.created,
      "Success Adding Data Lanjutan",
      dataToReturn
    );
  } catch (error) {
    await transaction.rollback();

    return errorResponse(
      res,
      Http.internalServerError,
      "Failed To Add Data",
      error
    );
  }
};

// Callback Add Data Barang
const addDataBarang = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();
    const {
      DataToInput: { listDataBarang, reportId },
    } = req.body;
    const promises = [];

    const found = await getOneSpecificReport(req, reportId);

    if (!found) {
      return errorResponse(res, Http.badRequest, "Report Not Found");
    }

    const ReportInfo = found.toJSON().jenisPemberitahuan;

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
        sourceId: reportId,
        sourceType: type,
      },
      transaction
    );

    // Loop Dengan Async
    for (let index = 0; index < listDataBarang.length; index++) {
      const result = await createListBarang(
        listDataBarang[index],
        transaction,
        reportId
      );

      if (result.error) {
        return errorResponse(res, Http.badRequest, result.error);
      }

      await insertHistoryBarang(
        req,
        res,
        {
          idBarang: listDataBarang[index].idBarang,
          desc: desc,
          quantityItem: listDataBarang[index].quantity,
          status: stats,
          sourceId: reportId,
          sourceType: type,
          userId: req.currentUser,
        },
        transaction
      );

      promises.push(result);
    }
    // return;

    const dataToReturn = {
      listDataBarang: promises.map((ele) => ele.id),
      reportId: reportId,
    };

    if (req.currentRole !== "Owner") {
      await createUserActivity(
        req.currentUser,
        reportId,
        `Create Report "Data Barang"`
      );
    }

    await transaction.commit();

    return successResponse(
      res,
      Http.created,
      "Success Adding List Barang",
      dataToReturn
    );
  } catch (error) {
    await transaction.rollback();
    return errorResponse(res, Http.internalServerError, error.message);
  }
};

/**
 * Testing Purpose
 */
const decrypt = async (req, res) => {
  res.json(Encryption.AESDecrypt(req.body.tes));
};
/**
 * 1. Found All Report Including The Relation Base of ID

 * 2. Then Bundle The Data Report That already found Into new Req.Body 

 * 3. Create 3 Function Seperatly for Header Input, Lanjutan Input, and Baragn Input
 */
const duplicateData = async (req, res, next) => {
  try {
    const { idReport } = req.params;

    const found = await getOneReport(req, idReport);

    if (!found) {
      return errorResponse(res, Http.badRequest, "Report Not Exists");
    }
    const convert = found.toJSON();

    const report = {
      pengajuanSebagai: convert.pengajuanSebagai,
      kantorPengajuan: convert.kantorPengajuan,
      jenisPemberitahuan: convert.jenisPemberitahuan,
      jenisMasuk: convert.jenisMasuk,
      userId: convert.userId,
      typeReport: convert.typeReport,
      BCDocumentType: convert.BCDocumentType,
      nomorAjuan: convert.nomorAjuan,
      // status: convert.status
    };

    req.body = {
      Report: report,
      ConvertResult: convert,
    };

    next();
  } catch (error) {
    return errorResponse(
      res,
      Http.internalServerError,
      "Failed Duplicate The Report"
    );
  }
};

const duplicateReport = async (req, res, next) => {
  try {
    const result = await createReportDuplicate(req.body.Report);
    req.id = result.toJSON().id;
    const convert = req.body.ConvertResult;

    delete convert.DataPengajuan.id;
    convert.DataPengajuan.reportId = result.toJSON().id;

    delete convert.IdentitasPenerima.id;
    convert.IdentitasPenerima.reportId = result.toJSON().id;

    delete convert.reportIdentitasPPJK.id;
    convert.reportIdentitasPPJK.reportId = result.toJSON().id;

    delete convert.IdentitasPengirim.id;
    convert.IdentitasPengirim.reportId = result.toJSON().id;

    delete convert.DataBeratDanVolume.id;
    convert.DataBeratDanVolume.reportId = result.toJSON().id;

    delete convert.DataPelabuhanMuatBongkar.id;
    convert.DataPelabuhanMuatBongkar.reportId = result.toJSON().id;

    delete convert.DataPengangkutan.id;
    convert.DataPengangkutan.reportId = result.toJSON().id;

    delete convert.DataPetiKemasDanPengema.id;
    convert.DataPetiKemasDanPengema.reportId = result.toJSON().id;

    delete convert.DataTempatPenimbunan.id;
    convert.DataTempatPenimbunan.reportId = result.toJSON().id;

    delete convert.TransaksiPerdagangan.id;
    convert.TransaksiPerdagangan.reportId = result.toJSON().id;

    delete convert.DataPerkiraanTanggalPengeluaran.id;
    convert.DataPerkiraanTanggalPengeluaran.reportId = result.toJSON().id;

    delete convert.DataLarta.id;
    convert.DataLarta.reportId = result.toJSON().id;

    const header = {
      dataPengajuan: convert.DataPengajuan,
      identitasPenerima: convert.IdentitasPenerima,
      reportIdentitasPPJK: convert.reportIdentitasPPJK,
      identitasPengirim: convert.IdentitasPengirim,
      dataBeratDanVolume: convert.DataBeratDanVolume,
      dataPelabuhanMuatBongkar: convert.DataPelabuhanMuatBongkar,
      dataPengangkutan: convert.DataPengangkutan,
      dataPetiKemasDanPengemas: convert.DataPetiKemasDanPengema,
      dataTempatPenimbunan: convert.DataTempatPenimbunan,
      transaksiPerdagangan: convert.TransaksiPerdagangan,
      dataPerkiraanTanggalPengeluaran: convert.DataPerkiraanTanggalPengeluaran,
      dataLartas: convert.DataLarta,
    };

    const lanjutan = {
      listDokumen: [],
    };

    for (let i = 0; i < convert.ListDokumens.length; i++) {
      const element = convert.ListDokumens[i];
      delete element.id;
      element.reportId = result.toJSON().id;
      lanjutan.listDokumen.push(element);
    }

    delete convert.DataPetiKema.id;
    convert.DataPetiKema.reportId = result.toJSON().id;

    lanjutan["dataPetiKemas"] = convert.DataPetiKema;

    const barang = [];
    for (let i = 0; i < convert.listBarangs.length; i++) {
      const element = convert.listBarangs[i];
      delete element.id;
      delete element.Barang;
      element.reportId = result.toJSON().id;
      barang.push(element);
    }

    req.body = {
      Header: header,
      Lanjutan: lanjutan,
      Barang: barang,
    };

    next();
  } catch (error) {
    return errorResponse(res, Http.internalServerError, "Failed Add Report");
  }
};

const duplicateHeader = async (req, res, next) => {
  let transaction;
  try {
    const { Header } = req.body;
    transaction = await sequelize.transaction();
    req.trans = transaction;

    const dataPengajuanResult = await createDataPengajuan(
      Header.dataPengajuan,
      transaction
    ); // Simpan Ke Table Data Pengajuan

    const identitasPenerimaResult = await createReportIdentitasPenerima(
      Header.identitasPenerima,
      transaction
    ); // Revision

    const ppjkResult = await createPPJK(
      Header.reportIdentitasPPJK,
      transaction
    );

    const identitasPengirimResult = await createReportIdentitasPengirim(
      Header.identitasPengirim,
      transaction
    ); // Simpan Ke Table Identitas Pengirim

    const transaksiPerdaganganResult = await createReportTransaksiPerdagangan(
      Header.transaksiPerdagangan,
      transaction
    ); // Simpan Ke Table Transaksi

    const pengangkutanResult = await createDataPengangkutan(
      Header.dataPengangkutan,
      transaction
    );

    const pelabuhanMuatBongkarResult = await createDataPelabuhanMuatBongkar(
      Header.dataPelabuhanMuatBongkar,
      transaction
    );

    const beratDanVolumeResult = await createDataBeratDanVolume(
      Header.dataBeratDanVolume,
      transaction
    );

    const petiKemasDanPengemasResult = await createDataPetiKemasDanPengemas(
      Header.dataPetiKemasDanPengemas,
      transaction
    );

    const tempatPenimbunanResult = await createDataTempatPenimbunan(
      Header.dataTempatPenimbunan,
      transaction
    );

    const dataLartasResult = await createDataLartas(
      Header.dataLartas,
      transaction
    );

    const perkiraanTanggalResult = await createPerkiraanTanggalPengeluaran(
      Header.dataPerkiraanTanggalPengeluaran,
      transaction
    );

    next();
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    return errorResponse(res, Http.internalServerError, "Failed Add Report");
  }
};

const duplicateLanjutan = async (req, res, next) => {
  let transaction;
  try {
    const { Lanjutan } = req.body;

    transaction = req.trans;

    /**
     * Data Lanjutan
     */
    for (let i = 0; i < Lanjutan.listDokumen.length; i++) {
      const element = Lanjutan.listDokumen[i];
      await createListDokumen(element, transaction);
    }

    await createDataPetiKemas(Lanjutan.dataPetiKemas, transaction);

    next();
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    return errorResponse(res, Http.internalServerError, "Failed Add Report");
  }
};

const duplicateBarang = async (req, res) => {
  let transaction;
  try {
    const { Barang } = req.body;

    transaction = req.trans;

    for (let i = 0; i < Barang.length; i++) {
      const element = Barang[i];
      await createListBarang(element, transaction, req.id);
    }

    await transaction.commit();
    if (req.currentRole !== "Owner") {
      await createUserActivity(req.currentUser, req.id, "Duplicate Report");
    }

    return successResponse(res, Http.created, "Success Duplicate Report");
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    return errorResponse(res, Http.internalServerError, "Failed Add Report");
  }
};

module.exports = (routes) => {
  // Create report
  routes.post(
    "/", // --> url
    authentication,
    bundleReport,
    validationReport,
    validationResponse,
    addReport
  );

  // Create Data Header
  routes.post(
    "/data-header",
    authentication,
    dataPengajuan,
    ppjk,
    identitasPengirim,
    identitasPenerima,
    transaksiPerdagangan,
    dataPengangkut,
    dataPelabuhanMuatBongkar,
    beratDanVolume,
    dataPetiKemasDanPengemas,
    dataTempatPenimbunan,
    dataPerkiraanTanggalPengeluaran,

    validationDataPengajuan,
    validationPPJK,
    validationIdentitasPengirim,
    validationIdentitasPenerima,
    validationTransaksiPerdagangan,
    validationDataPengangkutan,
    validationDataPelabuhanMuatBongkar,
    validationBeratDanVolume,
    validationDataPetiKemasDanPengemas,
    validationDataTempatPenimbunan,
    validationDataPerkiraanTanggalPengeluaran,

    validationResponse, // --> Middleware
    addDataHeader
  );

  // Create Data Lanjutan
  routes.post(
    "/data-lanjutan",
    authentication,
    dataDokumen,
    petiKemas,
    validationArrListDokumen,
    validationPetiKemas,
    validationResponse,
    addDataLanjutan
  );

  // Create Data Barang
  routes.post(
    "/data-barang",
    authentication,
    BDataBarang,
    VListBarang,
    validationResponse,
    addDataBarang
  );

  routes.post(
    "/duplicate/:idReport",
    authentication,
    duplicateData,
    duplicateReport,
    duplicateHeader,
    duplicateLanjutan,
    duplicateBarang
  );

  /**
   * Testign purpose
   * Check Hasil Decrypt
   */
  routes.post("/test", decrypt);
};
