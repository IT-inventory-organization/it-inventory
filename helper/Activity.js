const moment = require("moment/moment");
const { Op } = require("sequelize");
const Barang = require("../database/models/barang");
const CardList = require("../database/models/cardList");
const DeliveryOrder = require("../database/models/deliveryOrder");
const DeliveryOrderBarang = require("../database/models/deliveryOrderBarang");
const Invoice = require("../database/models/invoice");
const InvoiceDetail = require("../database/models/invoiceDetail");
const SalesOrder = require("../database/models/salesOrder");
const SalesOrderBarang = require("../database/models/salesOrderBarang");
const UserActivity = require("../database/models/useractivity");
const { ActivityUser } = require("./Activity.interface");

module.exports = {
  ActivitiesDelivery: async (transaction = null) => {
    const Delivery = await UserActivity.findAll({
      limit: 30,
      order: [["updatedAt", "DESC"]],
      attributes: ["updatedAt", "sourceId"],
      where: {
        updatedAt: {
          [Op.lte]: moment().toDate(),
          [Op.gte]: moment().subtract(1, "month").toDate(),
        },
        sourceType: ActivityUser.DeliveryOrder,
      },
      transaction,
    });

    const Def = [];

    for (const iterator of Delivery) {
      const it = iterator.toJSON();
      const DefDetail = await DeliveryOrder.findOne({
        where: {
          id: +it.sourceId,
          isDelete: false,
        },
        transaction,
        attributes: ["id", "tanggal", "approve"],
        include: [
          {
            model: SalesOrder,
            attributes: ["total"],
            where: { isDelete: false },
            include: [
              {
                model: CardList,
                attributes: ["name"],
                where: { isDelete: false },
              },
            ],
          },
          {
            model: DeliveryOrderBarang,
            where: { isDelete: false },
            attributes: ["id", "quantityReceived"],
            include: [
              {
                model: SalesOrderBarang,
                attributes: ["quantity", "hargaSatuan", "jumlah"],
                include: [
                  {
                    model: Barang,
                    where: { isDelete: false },
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
        ],
      });
      Def.push({ ...DefDetail.toJSON(), Act: it.updatedAt });
      //   console.log(DefDetail.toJSON());
      //   break;
    }
    const Payload = [];
    for (const it of Def) {
      const Pay = {
        id: +it.id,
        tanggal: moment(it.tanggal).toDate(),
        tanggalActivity: it.Act,
        total: +it.SalesOrder.total,
        approve: it.approve,
        Type: ActivityUser.DeliveryOrder,
        NamaCustomer: it.SalesOrder.CardList.name,
        NamaBarang: it.DeliveryOrderBarangs.map((x) => x.SalesOrderBarang),
      };
      Payload.push(Pay);
    }

    return Payload;
  },

  ActivityInvoice: async (transaction = null) => {
    const Inv = await UserActivity.findAll({
      limit: 30,
      order: [["updatedAt", "DESC"]],
      attributes: ["updatedAt", "sourceId"],
      where: {
        updatedAt: {
          [Op.lte]: moment().toDate(),
          [Op.gte]: moment().subtract(1, "month").toDate(),
        },
        sourceType: ActivityUser.Invoice,
      },
      transaction,
    });
    const I = [];
    for (const iterator of Inv) {
      const it = iterator.toJSON();
      const InvDetail = await Invoice.findOne({
        where: {
          id: +it.sourceId,
          isDelete: false,
        },
        transaction,
        attributes: ["id", "tanggalInvoice", "approve"],
        include: [
          {
            model: DeliveryOrder,
            attributes: ["id"],
            include: [
              {
                model: SalesOrder,
                attributes: ["total"],
                include: [
                  {
                    model: CardList,
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
          {
            model: InvoiceDetail,
            attributes: ["id"],
            include: [
              {
                model: DeliveryOrderBarang,
                attributes: ["id"],
                include: [
                  {
                    model: SalesOrderBarang,
                    attributes: ["hargaSatuan", "jumlah"],
                    include: [
                      {
                        model: Barang,
                        attributes: ["name"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      I.push({ ...InvDetail.toJSON(), Act: it.updatedAt });
    }

    const Payload = [];
    for (const it of I) {
      const Pay = {
        id: +it.id,
        tanggal: moment(it.tanggalInvoice).toDate(),
        total: +it.DeliveryOrder.SalesOrder.total,
        tanggalActivity: it.Act,
        approve: it.approve,
        Type: ActivityUser.Invoice,
        NamaCustomer: it.DeliveryOrder.SalesOrder.CardList.name,
        NamaBarang: it.InvoiceDetails.map(
          (x) => x.DeliveryOrderBarang.SalesOrderBarang
        ),
      };
      Payload.push(Pay);
    }

    return Payload;
  },
};
