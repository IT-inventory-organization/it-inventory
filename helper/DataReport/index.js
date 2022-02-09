const { Op } = require("sequelize");
const sequelize = require("../../configs/database");
const Report = require("../../database/models/report");
const reportIdentitasPenerima = require("../../database/models/identitaspenerima");
const reportIdentitasPengirim = require("../../database/models/identitaspengirim");
const reportListBarang = require("../../database/models/listbarang");
const reportListDokumen = require("../../database/models/listdokumen");
const reportDataPerkiraanTanggalPengeluaran = require("../../database/models/dataperkiraantanggalpengeluaran");
const reportDataBeratDanVolume = require("../../database/models/databeratdanvolume");
const reportDataPelabuhanMuatBongkar = require("../../database/models/datapelabuhanmuatbongkar");
const reportDataPengajuan = require("../../database/models/datapengajuan");
const reportDataPengangkutan = require("../../database/models/datapengangkutan");
const reportDataPetiKemas = require("../../database/models/datapetikemas");
const reportDataPetiKemasDanPengemas = require("../../database/models/datapetikemasdanpengemas");
const reportDataTempatPenimbunan = require("../../database/models/datatempatpenimbunan");
const reportTransaksiPerdagangan = require("../../database/models/transaksiperdagangan");
const User = require("../../database/models/user");
const authorization = require("../authorization");
const reportDataLartas = require("../../database/models/datalartas");
const Barang = require("../../database/models/barang");
const { isExist } = require("../checkExistingDataFromTable");
const reportIdentitasPPJK = require("../../database/models/identitasppjk");

const createReport = async (data) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const result = await Report.create(data, { transaction });

    await Report.update(
      { nomorAjuan: result.toJSON().id },
      { where: { id: result.toJSON().id }, transaction }
    );
    await transaction.commit();
    return result;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw Error(error.message);
  }
};

const createReportDuplicate = async (data) => {
  try {
    const result = await Report.create(data);
    return result;
  } catch (error) {
    throw Error(error.message);
  }
};

const updateReport = async (id, data, req) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    // const found = await Report.findOne({where: {id: id}, transaction});
    // if(!found){
    //     throw new Error('Data Not Found');
    // }

    // const resultToCheck = [];
    // if(found.toJSON().jenisPemberitahuan !== data.jenisPemberitahuan){
    //     const listBarangOfExistingData = await reportListBarang.findAll({where:{reportId: id}}, transaction);

    //     if(data.jenisPemberitahuan === 'Export'){
    //         for (let i = 0; i < listBarangOfExistingData.length; i++) {
    //             const jsonListBarang = listBarangOfExistingData[i].toJSON();
    //             const Dec = await Barang.decrement('stock', {
    //                 by: 2 * +jsonListBarang.quantity,
    //                 where: {
    //                     id: jsonListBarang.idBarang,
    //                     userId: req.currentUser
    //                 },
    //                 transaction
    //             });
    //             if(Dec[0][0][0].stock < 0){
    //                 throw new Error(`Stock ${Dec[0][0][0].name} Reach Minus, Update Failed`);
    //             }
    //             resultToCheck.push(Dec)
    //         }
    //     }else if(data.jenisPemberitahuan === 'Import'){
    //         for(let i = 0; i < listBarangOfExistingData.length; i++){
    //             const jsonListBarang = listBarangOfExistingData[i].toJSON();
    //             const Inc = await Barang.increment('stock', {
    //                 by: 2 * +jsonListBarang.quantity,
    //                 where: {
    //                     id: jsonListBarang.idBarang,
    //                     userId: req.currentUser
    //                 },
    //                 transaction
    //             })

    //             resultToCheck.push(Inc)
    //         }
    //     }
    //     if(resultToCheck.length !== listBarangOfExistingData.length){
    //         throw new Error('Failed To Update Report')
    //     }
    // }

    const checkForExistingReport = await Report.findOne({
      where: { id: id, userId: req.currentUser },
      transaction,
    });

    if (!checkForExistingReport) {
      throw new Error("Data Not Found");
    }

    const result = await Report.update(data, {
      where: { id: id },
      transaction,
    });
    if (result[0] == 0) {
      throw new Error(`Data Didn't Exists`);
    }
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const checkAuthorization = async (req, idReport, transaction) => {
  if (!(await authorization(Report, idReport, req))) {
    throw new Error(`User is Not Authorized To Change The Data`);
  }
  return;
};

const countAllReport = async (req) => {
  try {
    let searchBasedUserId = "";
    if (req.currentRole !== "Admin" && req.currentRole !== "Owner") {
      searchBasedUserId = `AND "userId" = ${req.currentUser}`;
    }
    const res = sequelize.query(
      `SELECT "count"("jenisPemberitahuan"),"jenisPemberitahuan" FROM "Reports" WHERE "isDelete" = false ${searchBasedUserId} GROUP BY "jenisPemberitahuan"`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

const countReportByType = async (type, req) => {
  try {
    let searchBasedUserId = "";
    if (req.currentRole !== "Admin" && req.currentRole !== "Owner") {
      searchBasedUserId = `AND "userId" = ${req.currentUser}`;
    }

    const res = sequelize.query(
      `SELECT "count"("jenisPemberitahuan"),"jenisPemberitahuan" FROM "Reports" WHERE status = '${type}' AND "isDelete" = false ${searchBasedUserId} GROUP BY "jenisPemberitahuan"`
    );
    // const result = await Report.count({
    //     where: {
    //         [Op.and]: [
    //             {'status': type},
    //             {'isDelete': false}
    //         ],
    //         userId: req.currentUser
    //     },
    //     group: [
    //         []
    //     ]
    // });
    return res;
  } catch (error) {
    throw error;
  }
};

const deleteReport = async (idType, req) => {
  let transaction;
  try {
    if (!(await authorization(Report, idType, req))) {
      throw new Error("User Is Not Authorized To Delete This Data");
    }
    transaction = await sequelize.transaction();
    const query = {
      where: {
        id: idType,
        userId: req.currentUser,
        isDelete: false,
      },
    };

    const foundExistingReport = await Report.findOne({
      ...query,
      transaction,
    });

    if (!foundExistingReport) {
      throw new Error(`Data Not Found, Delete failed`);
    }
    /**
    const jenisPemberitahuan = foundExistingReport.toJSON().jenisPemberitahuan;

    const foundlistBarang = await reportListBarang.findAll({
      where: { reportId: idType },
      transaction,
    });

    if (!foundlistBarang) {
      throw new Error(`Data Not Found, Delete Failed`);
    }
    const resultsChange = [];

    if (jenisPemberitahuan === "Export") {
      for (let i = 0; i < foundlistBarang.length; i++) {
        const listBarang = foundlistBarang[i].toJSON();
        const Inc = await Barang.increment("stock", {
          by: listBarang.quantity,
          where: {
            id: listBarang.idBarang,
            userId: req.currentUser,
          },
          transaction,
        });
        resultsChange.push(Inc);
      }
    } else if (jenisPemberitahuan === "Import") {
      for (let i = 0; i < foundlistBarang.length; i++) {
        const listBarang = foundlistBarang[i].toJSON();
        
        const Dec = await Barang.decrement("stock", {
          by: listBarang.quantity,
          where: {
            id: listBarang.idBarang,
            userId: req.currentUser,
          },
          transaction,
        });
        
        if (Dec[0][0][0].stock < 0) {
          throw new Error("Stock Reach Minus, Delete Failed");
        }
        resultsChange.push(Dec);
      }
    }

    if (resultsChange.length !== foundlistBarang.length) {
      throw new Error("Failed Delete Report");
    }
    */
    const result = await Report.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: idType,
        },
        transaction,
      }
    );

    await transaction.commit();

    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 *
 * @param {Request} req
 * @param {number} pageSize
 * @param {number} pageNo
 * @param {number} sortBy
 * @param {string} searchQuery
 * @param {string} type
 * @returns
 */

const getAllReport = async (
  req,
  pageSize,
  pageNo,
  sortBy,
  searchQuery = null,
  type = null,
  status = null
) => {
  try {
    let searchUser = "AND";
    let qtSearch = "";
    let orderQuery = "";
    let typeQuery = "";
    let statusQuery = "";
    const limit = pageSize ? +pageSize : 10;
    const offset = pageNo ? (+pageNo - 1) * pageSize : 0;

    switch (sortBy) {
      case "oldest":
        orderQuery += `ORDER BY "RP"."createdAt" ASC`;
        break;
      default:
        orderQuery += `ORDER BY "RP"."createdAt" DESC`;
        break;
    }

    if (req.currentRole !== "Admin" && req.currentRole !== "Owner") {
      // Jika User
      searchUser += `"RP"."userId" = ${req.currentUser}`;
    }

    if (searchQuery != null) {
      if (req.currentRole !== "Admin" && req.currentRole !== "Owner") {
        qtSearch += `AND `;
      }
      qtSearch += `("RP"."typeReport"||' '||"RP"."BCDocumentType" ILIKE '%${searchQuery}%' OR "RP"."id"::text ILIKE '%${searchQuery}%' OR TO_CHAR("RP"."createdAt", 'dd-mm-yyyy HH24:MI:ss')::text ILIKE '%${searchQuery}%' OR "US"."id"::text ILIKE '%${searchQuery}%' OR TO_CHAR("US"."createdAt", 'dd-mm-yyyy') ILIKE '%${searchQuery}%' OR "IPG"."namaPengirim" ILIKE '%${searchQuery}%' OR ip."namaPPJK" ILIKE '%${searchQuery}%' OR "RP".status::text ILIKE '%${searchQuery}%' OR "RP"."nomorAjuan"::text ILIKE '%${searchQuery}%')`;
    }

    if (type != null) {
      if (
        (req.currentRole !== "Admin" && req.currentRole !== "Owner") ||
        searchQuery != null
      ) {
        typeQuery += `AND `;
      }
      typeQuery += `"RP"."typeReport" = '${type}'`;
    }
    if (status != null) {
      if (
        (req.currentRole !== "Admin" && req.currentRole !== "Owner") ||
        searchQuery != null ||
        type != null
      ) {
        statusQuery += `AND `;
      }
      if (status == "All") {
        statusQuery += `"RP".status IS NOT NULL`;
      } else if (status == "Approval") {
        statusQuery += `"RP".status IS NULL`;
      } else {
        statusQuery += `"RP".status = '${status}'`;
      }
    }

    if (req.currentRole === "Admin" || req.currentRole === "Owner") {
      if (searchQuery == null) {
        if (type == null) {
          if (status == null) {
            searchUser = " "; // Membuang AND
          }
        }
      }
    }
    // console.log(
    //   `SELECT "RP".id as id, "RP"."typeReport"||' '||"RP"."BCDocumentType" as "jenisInventory", "RP"."nomorAjuan" as "nomorAjuan", TO_CHAR("RP"."createdAt", 'dd-mm-yyyy HH24:MI:ss') as "tanggalAjuan", "IPG"."namaPengirim" as pengirim, ip."namaPPJK" as penerima, "RP".status as jalur, "RP"."isEditable" as edit FROM "Reports" as "RP" LEFT OUTER JOIN "Users" as "US" ON ("RP"."userId" = "US"."id") LEFT OUTER JOIN "IdentitasPengirim" as "IPG" ON ("RP"."id" = "IPG"."reportId") LEFT OUTER JOIN "IdentitasPPJK" as ip ON ("RP"."id" = ip."reportId") WHERE "RP"."isDelete" = false ${searchUser} ${statusQuery} ${qtSearch} ${typeQuery} ${orderQuery} LIMIT ${limit} OFFSET ${offset}`
    // );
    const res = await sequelize.query(
      `SELECT "RP".id as id, "RP"."typeReport"||' '||"RP"."BCDocumentType" as "jenisInventory", "RP"."nomorAjuan" as "nomorAjuan", TO_CHAR("RP"."createdAt", 'dd-mm-yyyy HH24:MI:ss') as "tanggalAjuan", "IPG"."namaPengirim" as pengirim, ip."namaPPJK" as penerima, "RP".status as jalur, "RP"."isEditable" as edit FROM "Reports" as "RP" LEFT OUTER JOIN "Users" as "US" ON ("RP"."userId" = "US"."id") LEFT OUTER JOIN "IdentitasPengirim" as "IPG" ON ("RP"."id" = "IPG"."reportId") LEFT OUTER JOIN "IdentitasPPJK" as ip ON ("RP"."id" = ip."reportId") WHERE "RP"."isDelete" = false ${searchUser} ${statusQuery} ${qtSearch} ${typeQuery} ${orderQuery} LIMIT ${limit} OFFSET ${offset}`
    );

    const resCount = await sequelize.query(
      `SELECT count(*) FROM "Reports" as "RP" LEFT OUTER JOIN "Users" as "US" ON ("RP"."userId" = "US".id) LEFT OUTER JOIN "IdentitasPengirim" as "IPG" ON ("RP".id = "IPG"."reportId") LEFT OUTER JOIN "IdentitasPPJK" as ip ON ("RP".id = ip."reportId") WHERE "RP"."isDelete" = false ${searchUser} ${statusQuery} ${qtSearch} ${typeQuery} GROUP BY "RP"."createdAt" ${orderQuery}`
    );

    const data = {
      data: res[0],
      data_size: +countTotal(resCount[0]),
      page_size: +pageSize,
      page: +pageNo || 1,
    };

    return data;
  } catch (error) {
    throw error;
  }
};

const countTotal = (arr) => {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += +arr[i].count;
  }
  return total;
};

const getAllReportByType = async (req, pageSize, pageNo, type = null) => {
  try {
    let searchUser = "";
    let typeQuery = "";
    const limit = pageSize ? +pageSize : 10;
    const offset = pageNo ? (+pageNo - 1) * pageSize : 0;

    if (req.currentRole !== "Admin" && req.currentRole !== "Owner") {
      // Jika User
      searchUser += `AND "RP"."userId" = ${req.currentUser}`;
    }

    if (type != null) {
      // if(req.currentRole !== "Admin" && req.currentRole !== "Owner") {
      typeQuery += `AND `;
      // }
      switch (type) {
        case "Import":
        case "import":
          typeQuery += `"RP"."jenisPemberitahuan" = 'Import'`;
          break;
        case "Export":
        case "export":
          typeQuery += `"RP"."jenisPemberitahuan" = 'Export'`;
          break;
        default:
          typeQuery = ``;
          break;
      }
    }

    const sql = `SELECT "RP"."typeReport"||' '||"RP"."BCDocumentType" as "jenisInventory", TO_CHAR("RP"."createdAt", 'dd-mm-yyyy') as "tanggalAjuan", "IPG"."namaPengirim" as pengirim, "IPN"."namaPPJK" as penerima, "RP".status as jalur FROM "Reports" as "RP" LEFT OUTER JOIN "Users" as "US" ON ("RP"."userId" = "US"."id") LEFT OUTER JOIN "IdentitasPengirim" as "IPG" ON ("RP"."id" = "IPG"."reportId") LEFT OUTER JOIN "IdentitasPPJK" as "IPN" ON ("RP"."id" = "IPN"."reportId") WHERE "RP".status = 'merah' AND "RP"."isDelete" = false ${searchUser} ${typeQuery} LIMIT ${limit} OFFSET ${offset}`;

    const count = `SELECT count(*) FROM "Reports" as "RP" LEFT OUTER JOIN "Users" as "US" ON ("RP"."userId" = "US"."id") LEFT OUTER JOIN "IdentitasPengirim" as "IPG" ON ("RP"."id" = "IPG"."reportId") LEFT OUTER JOIN "IdentitasPPJK" as "IPN" ON ("RP"."id" = "IPN"."reportId") WHERE "RP".status = 'merah' AND "RP"."isDelete" = false ${searchUser} ${typeQuery}`;

    const result = await sequelize.query(sql);
    const countAll = await sequelize.query(count);

    const data = {
      data: result[0],
      data_size: +countTotal(countAll[0]),
      page_size: +pageSize,
      page: +pageNo || 1,
    };

    return data;
  } catch (error) {
    return error;
  }
};

const getOneReport = async (req, id, statusCheck = false) => {
  try {
    const query = {};
    query.where = {
      id: id,
    };

    query.include = [
      {
        model: reportListBarang,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
          include: ["quantity", "id"],
        },
        required: false,
        include: [
          {
            model: Barang,
            attributes: {
              exclude: ["isDelete", "createdAt", "updatedAt", "userId"],
            },
            required: false,
          },
        ],
      },
      {
        model: reportDataPerkiraanTanggalPengeluaran,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportIdentitasPenerima,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportIdentitasPPJK,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportIdentitasPengirim,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportListDokumen,
        attributes: {
          exclude: ["createdAt", "updatedAt", "isDelete"],
        },
        where: {
          isDelete: false,
        },
        required: false,
      },
      {
        model: reportDataBeratDanVolume,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportDataPelabuhanMuatBongkar,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportDataPengajuan,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportDataPengangkutan,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportDataPetiKemas,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportDataPetiKemasDanPengemas,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportDataTempatPenimbunan,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: reportTransaksiPerdagangan,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        required: false,
      },
      {
        model: User,
        attributes: [
          "name",
          "email",
          "npwp",
          "address",
          "mobile_phone",
          "username",
        ],
      },
      // {
      //   model: reportDataLartas,
      //   attributes: {
      //     exclude: ["createdAt", "updatedAt"],
      //   },
      // },
    ];
    if (req.currentRole !== "Admin" && req.currentRole !== "Owner") {
      query.where = {
        [Op.and]: [{ id }, { userId: req.currentUser }],
      };
    }
    if (statusCheck) {
      query.where = {
        ...query.where,
        status: { [Op.not]: null },
      };
    }
    query.attributes = {
      exclude: ["createdAt", "updatedAt", "isDelete"],
    };
    query.where = {
      ...query.where,
      isDelete: false,
    };
    query.logging = console.log;
    const result = await Report.findOne(query);

    return result;
  } catch (error) {
    throw new Error(
      "Fail fetch data, please try again later, or refresh your browser"
    );
  }
};

const updateStatus = async (id, status) => {
  try {
    const result = await Report.update(
      {
        status: status,
        isEditable: false,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return result;
  } catch (error) {
    throw error.message;
  }
};

const getPerTable = async (model, idReport, type, transaction = null) => {
  try {
    const result = await model.findOne({
      include: [
        {
          model: Report,
          where: {
            [Op.and]: [{ typeReport: type }, { isDelete: false }],
          },
        },
      ],
      include: [],
      where: {
        reportId: idReport,
      },
      transaction: transaction,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const getPerTableBarangDokumen = async (
  model,
  idReport,
  type,
  transaction = null
) => {
  try {
    const result = await model.findAll({
      include: [
        {
          model: Report,
          where: {
            [Op.and]: [{ typeReport: type }, { isDelete: false }],
          },
        },
      ],
      include: [],
      where: {
        [Op.and]: [{ reportId: idReport }, { isDelete: false }],
      },
      transaction: transaction,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getOneSpecificReport = async (req, id) => {
  try {
    return Report.findOne({
      where: {
        id: id,
        isDelete: false,
        userId: req.currentUser,
      },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createReport,
  countReportByType,
  deleteReport,
  getAllReport,
  getOneReport,
  countAllReport,
  getAllReportByType,
  updateReport,
  updateStatus,
  checkAuthorization,
  getPerTable,
  getPerTableBarangDokumen,
  getOneSpecificReport,
  createReportDuplicate,
};
