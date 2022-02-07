const Invoice = require("../../database/models/invoice");
const { StatsInvoice } = require("../Activity.interface");

const AddInvoice = async (data, transaction = null) => {
  return Invoice.create(data, {
    transaction: transaction,
    returning: true,
  });
};

const UpdateInvoice = async (req, idInv, data, transaction = null) => {
  return Invoice.update(data, {
    where: {
      id: idInv,
      userId: req.currentUser,
      isDelete: false,
    },
    transaction: transaction,
    returning: true,
  });
};

const DeleteInvoice = async (req, idInv, transaction = null) => {
  return Invoice.update(
    {
      isDelete: true,
    },
    {
      where: {
        id: idInv,
        userId: req.currentUser,
      },
      transaction: transaction,
      returning: true,
    }
  );
};

const changeStatus = async (req, idInv, transaction = null) => {
  return Invoice.update(
    {
      status: StatsInvoice.DONE,
    },
    {
      where: {
        id: idInv,
      },
      transaction: transaction,
      returning: true,
    }
  );
};

module.exports = {
  AddInvoice,
  UpdateInvoice,
  DeleteInvoice,
  changeStatus,
};
