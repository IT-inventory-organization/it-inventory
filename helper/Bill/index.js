const Bill = require("../../database/models/bill");

const CreateBill = async (res, data, transaction = null) => {
  return Bill.create(data, {
    returning: true,
    transaction: transaction,
  });
};

const DeleteBill = async (idBill, transaction = null) => {
  return Bill.update(
    {
      isDelete: true,
    },
    {
      where: {
        id: idBill,
      },
      transaction: transaction,
      returning: true,
    }
  );
};

const UpdateBill = async (idBill, data, transaction = null) => {
  return Bill.update(data, {
    where: {
      id: idBill,
      isDelete: false,
    },
    transaction: transaction,
    returning: true,
  });
};

module.exports = {
  CreateBill,
  DeleteBill,
  UpdateBill,
};
