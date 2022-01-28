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

module.exports = {
  insertHistoryBarang,
};
