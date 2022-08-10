const DeliveryOrder = require("../../database/models/deliveryOrder");

const AddDeliveryOrder = async (data, transaction = null) => {
  return DeliveryOrder.create(data, {
    transaction: transaction,
    returning: true,
  });
};

const UpdateDeliveryOrder = async (req, idDo, data, transaction = null) => {
  return DeliveryOrder.update(data, {
    where: {
      id: idDo,
      userId: req.currentUser,
      isDelete: false,
    },
    transaction: transaction,
    returning: true,
  });
};

const DeleteDeliveryOrder = async (req, idDo, transaction = null) => {
  return DeliveryOrder.update(
    {
      isDelete: true,
    },
    {
      where: {
        id: idDo,
        userId: req.currentUser,
        isDelete: false,
      },
      transaction: transaction,
    }
  );
};

/**
 *
 * @param {string|number} idDo
 * @param {boolean} status
 * @param {import("sequelize").Transaction} transaction
 * @returns
 */
const UpdateStatusDeliveryOrderRepo = async (
  idDo,
  status,
  transaction = null
) => {
  return DeliveryOrder.update(
    { approve: status },
    {
      where: {
        id: +idDo,
        isDelete: false,
      },
      transaction: transaction,
    }
  );
};

module.exports = {
  AddDeliveryOrder,
  UpdateDeliveryOrder,
  DeleteDeliveryOrder,
  UpdateStatusDeliveryOrderRepo,
};
