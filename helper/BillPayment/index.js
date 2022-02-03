const BillPayment = require("../../database/models/billPayment");

const AddBillPayment = async (data, transaction = null) => {
  return BillPayment.create(data, {
    transaction: transaction,
    returning: true,
  });
};

const UpdateBillPayment = async (
  req,
  idBillPayment,
  data,
  transaction = null
) => {
  return BillPayment.update(data, {
    where: {
      id: idBillPayment,
      userId: req.currentUser,
      isDelete: false,
    },
    transaction: transaction,
    returning: true,
  });
};

const DeleteBillPayment = async (req, idBillPayment, transaction = null) => {
  return BillPayment.update(
    {
      isDelete: true,
    },
    {
      where: {
        id: idBillPayment,
        userId: req.currentUser,
        isDelete: false,
      },
      transaction: transaction,
      returning: true,
    }
  );
};

module.exports = {
  AddBillPayment,
  UpdateBillPayment,
  DeleteBillPayment,
};
