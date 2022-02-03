const { Op } = require("sequelize");
const DeliveryOrderBarang = require("../../database/models/deliveryOrderBarang");
const SalesOrderBarang = require("../../database/models/salesOrderBarang");

const AddDeliveryOrderBarang = async (data, transaction = null) => {
  return DeliveryOrderBarang.create(data, {
    transaction: transaction,
    returning: true,
  });
};

const UpdateDeliveryOrderBarang = async (
  req,
  idDeliveryBarang,
  data,
  transaction = null
) => {
  return DeliveryOrderBarang.update(data, {
    where: {
      id: idDeliveryBarang,
      isDelete: false,
    },
    transaction: transaction,
    returning: true,
  });
};

const SoftDeleteDeliveryOrderBarang = async (
  req,
  idDo,
  exception = [],
  transaction = null
) => {
  return DeliveryOrderBarang.update(
    { isDelete: true },
    {
      where: {
        idDo: idDo,
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
  AddDeliveryOrderBarang,
  UpdateDeliveryOrderBarang,
  SoftDeleteDeliveryOrderBarang,
};
