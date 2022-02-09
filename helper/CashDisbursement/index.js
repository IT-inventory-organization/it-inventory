const CashDisbursement = require("../../database/models/cashDisbursement");
const CashReceive = require("../../database/models/cashReceive");

module.exports = {
  AddCashDisbursement: async (data, transaction = null) => {
    return CashDisbursement.create(data, {
      transaction: transaction,
      returning: true,
    });
  },
  /**
   *
   * @param {String | Number} idCashReceive
   * @param {CashReceive} data
   * @param {Transaction} transaction
   * @returns
   */
  UpdateCashDisbursement: async (idCashReceive, data, transaction = null) => {
    return CashDisbursement.update(data, {
      where: {
        id: idCashReceive,
        isDelete: false,
      },
      transaction: transaction,
      returning: true,
    });
  },
  /**
   *
   * @param {String | Number} idCashReceive
   * @param {Transaction} transaction
   * @returns
   */
  DeleteCashDisbursement: async (idCashReceive, transaction = null) => {
    return CashDisbursement.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: idCashReceive,
          isDelete: false,
        },
        returning: true,
        transaction: transaction,
      }
    );
  },
};
