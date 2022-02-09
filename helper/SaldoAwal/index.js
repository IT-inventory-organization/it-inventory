const SaldoAwal = require("../../database/models/saldoAwal");

const AddSaldoAwal = async (data, transaction = null) => {
  return SaldoAwal.create(data, {
    transaction: transaction,
    returning: true,
  });
};

const DeleteSaldoAwal = async (transaction = null) => {
  return SaldoAwal.update(
    {
      isDelete: true,
    },
    {
      where: {
        isDelete: false,
      },
      transaction: transaction,
      returning: true,
    }
  );
};

module.exports = {
  AddSaldoAwal,
  DeleteSaldoAwal,
};
