const { Transaction, Op } = require("sequelize");
const UserPrivilages = require("../../database/models/userPrivilages");

module.exports = {
  /**
   *
   * @param {{any: any}} data
   * @param {Transaction} transaction
   * @returns {Promise}
   */
  addPrivilages: (data, transaction = null) => {
    return UserPrivilages.create(data, {
      transaction: transaction,
      returning: true,
    });
  },
  /**
   *
   * @param {number | string} idPrivilages - Delete One Of The Privilages
   * @param {Transaction} transaction
   * @returns
   */
  deletePrivilages: (idPrivilages = null, transaction = null) => {
    return UserPrivilages.delete(
      {
        isDelete: false,
      },
      {
        where: {
          id: idPrivilages,
          isDelete: false,
        },
        transaction: transaction,
        returning: true,
      }
    );
  },
  /**
   *
   * @param {number | string} isUser
   * @param {number | string} idPrivilages
   * @param {{any: any}} data
   * @param {Array.<number | string>} exception
   * @param {Transaction} transaction
   */
  updatePrivilages: (idUser, idPrivilages, data, transaction = null) => {
    return UserPrivilages.update(data, {
      where: {
        userId: idUser,
        id: idPrivilages,
        isDelete: false,
      },
      transaction: transaction,
      returning: true,
    });
  },
  softDeleteUserPrivilages: (idUser, exception = [], transaction = null) => {
    return UserPrivilages.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: {
            [Op.notIn]: exception,
          },
          userId: idUser,
          isDelete: false,
        },
        returning: true,
        transaction: transaction,
      }
    );
  },
};
