const { Op } = require("sequelize");
const BillPaymentItems = require("../../database/models/billPaymentItems");

const AddBillPaymentItems = async (data, transaction = null) => {
  return BillPaymentItems.create(data, {
    transaction: transaction,
    returning: true,
  });
};

const UpdateBillPaymentItems = async (
  idBillPaymentItems,
  data,
  transaction = null
) => {
  return BillPaymentItems.update(data, {
    where: {
      id: idBillPaymentItems,
      isDelete: false,
    },
    transaction: transaction,
    returning: true,
  });
};

const SoftDeleteBillPaymentItems = async (
  idBillPayment,
  exception = [],
  transaction = null
) => {
  return BillPaymentItems.update(
    {
      isDelete: true,
    },
    {
      where: {
        idBill: idBillPayment,
        id: {
          [Op.notIn]: exception,
        },
      },
      transaction: transaction,
      returning: true,
    }
  );
};

module.exports = {
  AddBillPaymentItems,
  UpdateBillPaymentItems,
  SoftDeleteBillPaymentItems,
};
