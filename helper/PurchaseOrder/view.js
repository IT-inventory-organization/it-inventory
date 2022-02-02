const Barang = require("../../database/models/barang");
const BarangPurchaseOrder = require("../../database/models/barangPurchaseOrder");
const CardList = require("../../database/models/cardList");
const PurchaseOrder = require("../../database/models/purchaseOrder");
const ReceiveItems = require("../../database/models/receivedItems");
const httpStatus = require("../Httplib");
const { errorResponse } = require("../Response");

const ViewPurchaseOrder = async (req, res) => {
  try {
    return PurchaseOrder.findAll({
      where: {
        userId: req.currentUser,
        isDelete: false,
      },
      attributes: ["id", "nomorPO", "tanggal"],
      include: [
        {
          model: BarangPurchaseOrder,
          attributes: [],
          where: {
            isDelete: false,
          },
        },
      ],
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List Purchase Order"
    );
  }
};

const OnePurchaseOrder = async (req, res, idPo, forUpdate = false) => {
  try {
    if (forUpdate) {
      return PurchaseOrder.findOne({
        where: {
          id: idPo,
          isDelete: false,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: CardList,
            attributes: [["name", "supplier"], "ID"],
          },
          {
            model: BarangPurchaseOrder,
            where: {
              isDelete: false,
            },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Barang,
                where: {
                  isDelete: false,
                },
                attributes: ["name", "satuanKemasan"],
              },
            ],
          },
        ],
      });
    }
    return PurchaseOrder.findOne({
      // logging:
      where: {
        id: idPo,
        isDelete: false,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "isDelete", "userId"],
      },
      include: [
        {
          model: CardList,
          attributes: [["name", "supplier"], "ID"],
        },
        {
          model: BarangPurchaseOrder,
          where: {
            isDelete: false,
          },
          attributes: [
            "quantity",
            "hargaSatuan",
            "jumlah",
            "id",
            "idPo",
            "idBarang",
          ],
          include: [
            {
              model: Barang,
              attributes: ["name", "satuanKemasan"],
            },
          ],
        },
      ],
    });
  } catch (error) {
    //
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch One List Purchase Order"
    );
  }
};

const checkExistingPo = async (req, res, idPo) => {
  try {
    const fetch = await PurchaseOrder.findOne({
      where: {
        id: idPo,
        isDelete: false,
        userId: req.currentUser,
      },
    });

    if (fetch) {
      return;
    }

    throw new Error("Data Didn't Exist");
  } catch (error) {
    return errorResponse(res, httpStatus.notFound, error.message);
  }
};

const fetchForReceiveItem = async (req, res, idPo) => {
  try {
    return PurchaseOrder.findOne({
      where: {
        id: idPo,
        isDelete: false,
      },
      attributes: ["idPo", "supplier", "nomorPO"],
      include: [
        {
          model: BarangPurchaseOrder,
          where: {
            isDelete: false,
          },
          attributes: ["id", "hargaSatuan", "quantity"],
          include: [
            {
              model: Barang,
              attributes: ["name", "satuanKemasan"],
            },
          ],
        },
      ],
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch Purchase Order"
    );
  }
};

const listOfPurchaseOrder = async (req, res) => {
  try {
    return PurchaseOrder.findAll({
      where: {
        userId: req.currentUser,
        isDelete: false,
      },
      // attributes: ["nomorPO", "id"],
      include: [
        {
          model: BarangPurchaseOrder,
          where: {
            isDelete: false,
          },
          attributes: [],
        },
        {
          model: ReceiveItems,
          where: {
            isDelete: false,
          },
          required: false,
        },
      ],
    });
  } catch (error) {
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Fetch List Purchase Order"
      // error
    );
  }
};

module.exports = {
  ViewPurchaseOrder,
  OnePurchaseOrder,
  checkExistingPo,
  fetchForReceiveItem,
  listOfPurchaseOrder,
};
