const { Op } = require("sequelize");
const ReceivePaymentDetail = require("../../database/models/receivePaymentDetail");

const AddReceivePaymentDetail = async (d, t = null) => {
  return ReceivePaymentDetail.create(d, {
    transaction: t,
    returning: true,
  });
};

const UpdateReceivePaymentDetail = async (i, d, t = null) => {
  return ReceivePaymentDetail.update(d, {
    where: {
      id: i,
      isDelete: false,
    },
    transaction: t,
    returning: true,
  });
};

const SoftDeleteReceivePaymentDetail = async (ir, e = [], t = null) => {
  return ReceivePaymentDetail.update(
    {
      isDelete: true,
    },
    {
      where: {
        idReceivePayment: ir,
        id: {
          [Op.notIn]: e,
        },
        isDelete: false,
      },
      transaction: t,
      returning: true,
    }
  );
};

module.exports = {
  AddReceivePaymentDetail,
  UpdateReceivePaymentDetail,
  SoftDeleteReceivePaymentDetail,
};
