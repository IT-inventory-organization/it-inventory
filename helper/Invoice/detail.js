const { Op } = require("sequelize");
const InvoiceDetail = require("../../database/models/invoiceDetail");

const AddDetailInvoice = async (data, transaction = null) => {
  return InvoiceDetail.create(data, {
    transaction: transaction,
    returning: true,
  });
};

const UpdateDetailInvoice = async (req, idDetInv, data, transaction = null) => {
  return InvoiceDetail.update(data, {
    where: {
      id: idDetInv,
      userId: req.currentUser,
      isDelete: false,
    },
    transaction: transaction,
    returning: true,
  });
};

const SoftDeleteDetailInvoice = async (
  idInv,
  exception = [],
  transaction = null
) => {
  return InvoiceDetail.update(
    {
      isDelete: true,
    },
    {
      where: {
        idInv: idInv,
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
  AddDetailInvoice,
  UpdateDetailInvoice,
  SoftDeleteDetailInvoice,
};
