const moment = require("moment/moment");
const { Op } = require("sequelize");
const Barang = require("../database/models/barang");
const CardList = require("../database/models/cardList");
const DeliveryOrder = require("../database/models/deliveryOrder");
const DeliveryOrderBarang = require("../database/models/deliveryOrderBarang");
const Invoice = require("../database/models/invoice");
const InvoiceDetail = require("../database/models/invoiceDetail");
const Role = require("../database/models/role");
const SalesOrder = require("../database/models/salesOrder");
const SalesOrderBarang = require("../database/models/salesOrderBarang");
const User = require("../database/models/user");
const { ActivityUser } = require("./Activity.interface");

module.exports = {
  FoundUser: async (id, transaction = null) => {
    return User.findOne({
      where: {
        id: +id,
        is_active: true,
      },
      transaction: transaction,
      attributes: ["name", "username"],
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });
  },
  FoundTotalDeliveryOrder: async (transaction = null) => {
    return DeliveryOrder.count({
      where: {
        isDelete: false,
      },
      transaction,
    });
  },
  FoundTotalInvoice: async (transaction = null) => {
    return Invoice.count({
      where: {
        isDelete: false,
      },
      transaction,
    });
  },
  FoundTotalBarang: async (transaction = null) => {
    return Barang.count({
      where: {
        isDelete: false,
      },
      transaction,
    });
  },
  FoundRecent: async () => {
    /**
     * @interface
     */
    // const Enum = {
    //   id: string,
    //   Type: DeliveryOrder || Invoice,
    //   NamaCustomer: string,
    //   NamaBarang: string,
    //   createdAt: Date,
    //   status: Boolean,
    //   Total: Number,
    // };
    const Payload = [];

    const DeliveryOrderPayload = await DeliveryOrder.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      where: {
        createdAt: {
          [Op.lte]: moment().toDate(),
          [Op.gte]: moment().subtract(1, "month").toDate(),
        },
      },
      attributes: ["id", "tanggal", "createdAt", "approve"],
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
    });

    const InvoicePayload = await Invoice.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      where: {
        createdAt: {
          [Op.lte]: moment().toDate(),
          [Op.gte]: moment().subtract(1, "month").toDate(),
        },
      },
      attributes: ["id", "tanggalInvoice", "createdAt", "approve"],
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

    for (const iterator of DeliveryOrderPayload) {
      const it = iterator.toJSON();
      //   console.log(it.DeliveryOrderBarangs[0].SalesOrderBarang.Barang);
      const PayloadDo = {
        id: +it.id,
        tanggal: moment(it.tanggal).toDate(),
        total: +it.SalesOrder.total,
        approve: it.approve,
        Type: ActivityUser.DeliveryOrder,
        NamaCustomer: it.SalesOrder.CardList.name,
        NamaBarang: it.DeliveryOrderBarangs.map((x) => x.SalesOrderBarang),
      };

      Payload.push(PayloadDo);
    }

    for (const iterator of InvoicePayload) {
      const it = iterator.toJSON();

      const PayloadInv = {
        id: +it.id,
        tanggal: moment(it.tanggalInvoice).toDate(),
        total: +it.DeliveryOrder.SalesOrder.total,
        approve: it.approve,
        Type: ActivityUser.Invoice,
        NamaCustomer: it.DeliveryOrder.SalesOrder.CardList.name,
        NamaBarang: it.InvoiceDetails.map(
          (x) => x.DeliveryOrderBarang.SalesOrderBarang
        ),
      };
      Payload.push(PayloadInv);
    }

    const Sorted = Payload.sort(
      (a, b) =>
        moment(a.tanggal).format("YYYYMMDD") -
        moment(b.tanggal).format("YYYYMMDD")
    ).reverse();

    return Sorted;
  },
};
