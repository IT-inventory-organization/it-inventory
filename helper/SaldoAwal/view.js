const SaldoAwal = require("../../database/models/saldoAwal");

const ViewOne = async (transaction = null, idSaldoAwal = null) => {
  let where = {
    isDelete: false,
  };
  if (idSaldoAwal) {
    where = {
      ...where,
      id: idSaldoAwal,
    };
  }
  return SaldoAwal.findOne({
    where: where,
    attributes: {
      exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
    },
    transaction: transaction,
  });
};

module.exports = {
  ViewOne,
};
