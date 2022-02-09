const { Op } = require("sequelize");
const CashDisbursement = require("../../database/models/cashDisbursement");

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
    return CashDisbursement.findAll({
      transaction: transaction,
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "isDelete"],
      },
      where,
    });
  },
  ViewOne: async (idCashDisbursement, transaction = null) => {
    return CashDisbursement.findOne({
      where: {
        id: idCashDisbursement,
        isDelete: false,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "isDelete"],
      },
      transaction: transaction,
    });
  },
};
