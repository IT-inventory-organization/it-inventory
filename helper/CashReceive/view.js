const { Op } = require("sequelize");
const CashReceive = require("../../database/models/cashReceive");

module.exports = {
  /**
   *
   * @param {Requres} req
   * @param {{string} startDate, {string} endDate}}
   * @param {Transaction} transaction
   */
  ViewAll: async (
    date = { startDate: "", endDate: "" },
    transaction = null
  ) => {
    let where = {
      isDelete: false,
    };
    if (date.startDate && date.endDate) {
      where = {
        ...where,
        tanggal: {
          [Op.between]: [date.startDate, date.endDate],
        },
      };
    }
    return CashReceive.findAll({
      transaction: transaction,
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "isDelete"],
      },
      where,
    });
  },
  ViewOne: async (idCashReceive, transaction = null) => {
    return CashReceive.findOne({
      where: {
        id: idCashReceive,
        isDelete: false,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "isDelete"],
      },
      transaction: transaction,
    });
  },
};
