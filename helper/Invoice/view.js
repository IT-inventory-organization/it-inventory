const CardList = require("../../database/models/cardList");
const DeliveryOrder = require("../../database/models/deliveryOrder");
const Invoice = require("../../database/models/invoice");
const InvoiceDetail = require("../../database/models/invoiceDetail");

const ViewOne = async (req, idInv, transaction = null) => {
  return Invoice.findOne({
    where: {
      userId: req.currentUser,
      id: idInv,
      isDelete: false,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
    },
    include: [
      {
        model: InvoiceDetail,
        where: {
          isDelete: false,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "isDelete"],
        },
      },
      {
        model: CardList,
        where: {
          isDelete: false,
        },
        attributes: ["name", "id"],
      },
    ],
    transaction: transaction,
  });
};

const ViewAllList = async (req, transaction = null) => {
  return Invoice.findAll({
    where: {
      userId: req.currentUser,
      isDelete: false,
    },
    transaction: transaction,
    attributes: ["noInvoice", "id", "tanggal"],
    include: [
      {
        model: DeliveryOrder,
        attributes: ["nomorDO", "id"],
        where: {
          isDelete: false,
        },
      },
    ],
  });
};

module.exports = {
  ViewOne,
  ViewAllList,
};
