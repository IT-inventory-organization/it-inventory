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
};
