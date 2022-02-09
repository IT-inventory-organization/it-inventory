const CashReceive = require("../../database/models/cashReceive");

module.exports = {
  AddCashReceive: async (data, transaction = null) => {
    return CashReceive.create(data, {
      transaction: transaction,
      returning: true,
    });
  },
  /**
   *
   * @param {String | Number} idCashReceive
   * @param {CashReceive} data
   * @param {Transaction} transaction
   * @returns CashReceive
   */
  UpdateCashReceive: async (idCashReceive, data, transaction = null) => {
    return CashReceive.update(data, {
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
  DeleteCashReceive: async (idCashReceive, transaction = null) => {
    return CashReceive.update(
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
