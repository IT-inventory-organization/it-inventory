const CardList = require("../../database/models/cardList");
const Invoice = require("../../database/models/invoice");
const ReceivePayment = require("../../database/models/receivePayment");
const ReceivePaymentDetail = require("../../database/models/receivePaymentDetail");

const ViewOne = async (r, i, t = null) => {
  return ReceivePayment.findOne({
    where: {
      id: i,
      userId: r.currentUser,
      isDelete: false,
    },
    transaction: t,
    attributes: {
      exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
    },
    include: [
      {
        model: ReceivePaymentDetail,
        where: {
          isDelete: false,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "isDelete", "idInvItem"],
        },
      },
      {
        model: CardList,
        attributes: ["name"],
      },
      {
        model: Invoice,
        attributes: ["noInvoice"],
      },
    ],
  });
};

const ViewAll = async (r, t = null) => {
  return ReceivePayment.findAll({
    where: {
      userId: r.currentUser,
      isDelete: false,
    },

    attributes: ["noReferensi", "tanggal", "metodePembayaran", "id"],
    transaction: t,
    include: [
      {
        model: ReceivePaymentDetail,
        where: {
          isDelete: false,
        },
        attributes: ["jumlahTotal"],
        required: false,
      },
      {
        model: CardList,
        required: false,
        where: {
          isDelete: false,
        },
        attributes: ["name", ["_ID", "ID"]],
      },
    ],
  });
};

module.exports = {
  ViewAll,
  ViewOne,
};
