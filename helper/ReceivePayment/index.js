const ReceivePayment = require("../../database/models/receivePayment");

const AddReceivePayment = async (d, t = null) => {
  return ReceivePayment.create(d, {
    transaction: t,
    returning: true,
  });
};

const UpdateReceivePayment = async (r, i, d, t = null) => {
  return ReceivePayment.update(d, {
    where: {
      id: i,
      isDelete: false,
      userId: r.currentUser,
    },
    transaction: t,
    returning: true,
  });
};

const DeleteReceivePayment = async (r, i, t = null) => {
  return ReceivePayment.update(
    {
      isDelete: true,
    },
    {
      where: {
        id: i,
        isDelete: false,
        userId: r.currentUser,
      },
      transaction: t,
      returning: true,
    }
  );
};

module.exports = {
  AddReceivePayment,
  UpdateReceivePayment,
  DeleteReceivePayment,
};
