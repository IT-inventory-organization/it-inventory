const { Op } = require("sequelize");
const BillPriceItem = require("../../database/models/billPriceItem");

const AddBillPriceItem = async (data, transaction = null) => {
  return BillPriceItem.create(data, {
    transaction: transaction,
    returning: true,
  });
};

const UpdateBillPriceItem = async (idBillPrice, data, transaction = null) => {
  return BillPriceItem.update(data, {
    where: {
      id: idBillPrice,
    },
    transaction: transaction,
    returning: true,
  });
};

const SoftDelelteBillPriceItem = async (
  idBlll,
  exception = [],
  transaction = null
) => {
  return BillPriceItem.update(
    {
      isDelete: true,
    },
    {
      where: {
        idBill: idBlll,
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
  AddBillPriceItem,
  UpdateBillPriceItem,
  SoftDelelteBillPriceItem,
};
