const sequelize = require("../../configs/database");
const Histories = require("../../database/models/history");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const insertHistoryBarang = async (
  req,
  res,
  data = {
    idBarang: "",
    quantityItem: "",
    status: "",
    desc: "",
    sourceId: "",
    sourceType: "",
    userId: "",
  },
  transaction = null
) => {
  try {
    const dataHistory = { ...data, userId: req.currentUser };
    return Histories.create(dataHistory, {
      transaction: transaction,
      returning: true,
    });
  } catch (error) {
    return errorResponse(res, httpStatus.internalServerError, error);
  }
};

const removeHistories = async (
  req,
  res,
  data = { sourceId: "", sourceType: "" },
  transaction = null
) => {
  return Histories.destroy({
    where: {
      sourceId: data.sourceId,
      sourceType: data.sourceType,
    },
    transaction: transaction,
    returning: true,
  });
};
module.exports = {
  insertHistoryBarang,
  removeHistories,
  historyBarang: async (idBarang, transaction = null) => {
    return sequelize.query(`
      SELECT 
        h.status as status,
        h."sourceType" as deskripsi,
        h."quantityItem" as quantity,
        0 as balance,
        h."createdAt" as tanggal
      FROM histories h
      LEFT OUTER JOIN "Barang" b ON h."idBarang" = b."id"
      WHERE h."idBarang" = ${idBarang}
    `);
  },
};
