const { body, validationResult } = require("express-validator");
const { errorResponse, successResponse } = require("../../helper/Response");
const Http = require("../../helper/Httplib");
const authentication = require("../../middlewares/authentication");
const {
  createListItem,
  softDeleteListItem,
  updateListItem,
  getListItem,
  updateStockItem,
  getItem,
} = require("../../helper/Barang");
const Crypt = require("../../helper/encription");
const {
  createUserActivity,
  CreateActivityUser,
} = require("../../helper/UserActivity");
const {
  getHistoryBarangPerItem,
  insertHistory,
} = require("../../helper/Histories");
const sequelize = require("../../configs/database");
const { historyBarang } = require("../../helper/Histories/barang");
const { calculateBalance, Returning } = require("../../helper/calculateStock");
const httpStatus = require("../../helper/Httplib");
const { ActivityUser } = require("../../helper/Activity.interface");

const validationItem = [
  body("dataItem.name").trim().notEmpty().withMessage(`Name is Not Provided`),
  body("dataItem.posTarif")
    .trim()
    .notEmpty()
    .withMessage(`"Pos Tarif Is Required`),
  body("dataItem.hsCode").trim().notEmpty().withMessage(`HS Code is Required`),
  body("dataItem.uraian").trim().notEmpty().withMessage(`"Uraian" is Required`),
  body("dataItem.nettoBrutoVolume")
    .trim()
    .notEmpty()
    .withMessage(`"Netto, Bruto, Volume" Is Required`),
  body("dataItem.satuanKemasan")
    .trim()
    .notEmpty()
    .withMessage(`"Satuan Kemasan" Is Required`),
  body("dataItem.stock").trim().notEmpty().withMessage(`Quantity is Required`),
];

const bundle = (req, res, next) => {
  try {
    const Decrypt = Crypt.AESDecrypt(req.body.item);

    req.body.dataItem = {
      ...Decrypt,
      userId: req.currentUser,
    };

    next();
  } catch (error) {
    throw errorResponse(res, Http.badRequest, "Failed To Add List Item");
  }
};

const createItemBarang = async (req, res) => {
  let t;
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return errorResponse(res, Http.badRequest, validation.array()[0].msg);
    }
    const { dataItem } = req.body;
    t = await sequelize.transaction();
    const result = await createListItem(dataItem, t);

    // if (req.currentRole != "Owner") {
    //   await createUserActivity(req.currentUser, null, "Create New List Item");
    // }

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create New Item",
          sourceId: result.id,
          sourceType: ActivityUser.Barang,
          userId: req.currentUser,
        },
        t
      );
    }
    await t.commit();
    return successResponse(
      res,
      Http.created,
      "Success Create List Item",
      result
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(res, Http.internalServerError, "Failed To Add Item");
  }
};

const deleteItemBarang = async (req, res) => {
  try {
    const { id } = req.params;

    await softDeleteListItem(req, id);

    if (req.currentRole != "Owner") {
      await createUserActivity(req.currentUser, null, "Delete List Item");
    }

    if (req.currentRole !== "Owner") {
      await CreateActivityUser({
        activity: "Delete Item",
        sourceId: id,
        sourceType: ActivityUser.Barang,
        userId: req.currentUser,
      });
    }

    return successResponse(res, Http.ok, "Success Delete List Item");
  } catch (error) {
    return errorResponse(res, Http.badRequest, error.message);
  }
};

const editItemBarang = async (req, res) => {
  let t;
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return errorResponse(res, Http.badRequest, validation.array()[0].msg);
    }

    const { id } = req.params;
    const { dataItem } = req.body;
    delete dataItem.id;
    t = await sequelize.transaction();
    const result = await updateListItem(req, id, dataItem, t);

    if (req.currentRole !== "Owner") {
      await createUserActivity(req.currentUser, null, "Update Item Barang");
    }

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Update Item",
          sourceId: id,
          sourceType: ActivityUser.Barang,
          userId: req.currentUser,
        },
        t
      );
    }
    await t.commit();
    return successResponse(res, Http.ok, "Success Update Item Barang", result);
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(res, Http.badRequest, "Failed To Edit Item");
  }
};

const getAnItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { pageSize, pageNo, search } = req.query;

    const param = {
      id: id,
      search: search,
      pageSize: pageSize,
      pageNo: pageNo,
    };

    const result = await getListItem(req, param);

    if (req.currentRole != "Owner") {
      await createUserActivity(
        req.currentUser,
        null,
        `Fetch Item ${id ? "All" : "One"} Data`
      );
    }

    if (!id) {
      const { data, ...restOfData } = result;
      const temp = [];

      for (const iterator of data) {
        const History = await historyBarang(iterator.idBarang);

        iterator.stock = calculateBalance(
          History[0],
          iterator.stock,
          Returning.CURRENT_STOCK
        );

        temp.push(iterator);
      }

      const mergeMap = {
        data: temp,
        ...restOfData,
      };

      return successResponse(res, httpStatus.ok, "", mergeMap);
    }

    return successResponse(res, Http.ok, "", result);
  } catch (error) {
    return errorResponse(res, Http.internalServerError, "Failed Fetch Item");
  }
};

const updateStock = async (req, res) => {
  let transaction;
  try {
    const { total } = Crypt.AESDecrypt(req.body.Total);

    if (total == null) {
      return errorResponse(res, Http.badRequest, "Number Value is Empty");
    }

    if (total <= 0) {
      return errorResponse(
        res,
        Http.badRequest,
        "Number Value Must Bigger Then Zero"
      );
    }

    const { id } = req.params;
    const { status } = req.query;

    transaction = await sequelize.transaction();

    const resultStockItem = await updateStockItem(
      req,
      id,
      status,
      total,
      null,
      transaction
    );

    // if (req.currentRole != "Owner") {
    //   await createUserActivity(req.currentUser, null, `Update Stock`);
    // }

    if (req.currentRole !== "Owner") {
      await CreateActivityUser(
        {
          activity: "Create Adjustmnet Item",
          sourceId: id,
          sourceType: ActivityUser.Adjustment,
          userId: req.currentUser,
        },
        transaction
      );
    }

    await insertHistory(
      {
        idBarang: id,
        quantityItem: total,
        status: status,
        desc: getDesc(status),
        sourceId: id,
        sourceType: ActivityUser.Adjustment,
        userId: req.currentUser,
      },
      transaction
    );

    await transaction.commit();
    return successResponse(res, Http.created, "", resultStockItem);
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    return errorResponse(res, Http.internalServerError, error.message);
  }
};

const getDesc = (val) => {
  if (/(increase)/.test(val)) {
    return "Penambahan Barang";
  } else if (/(decrease)/.test(val)) {
    return "Pengurangan Barang";
  }
};

const historyDataBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    let stats = false;
    if (type == `noReport`) {
      stats = true;
    }

    const result = await getHistoryBarangPerItem(req, id, stats);
    if (result.length == 0) {
      return errorResponse(res, Http.badRequest, "Data Not Found");
    }
    const name = await getListItem(req, { id: id });

    let qry = [];

    for (let i = 0; i < result.length; i++) {
      let obj = {};

      obj["name"] = name[0].name;
      const keys = Object.keys(result[i]);
      for (let j = 0; j < keys.length; j++) {
        const seperate = keys[j].split(".");

        obj[seperate[seperate.length - 1]] = result[i][`${seperate.join(".")}`];
      }

      qry.push(obj);
      delete obj;
    }

    if (req.currentRole != "Owner") {
      await createUserActivity(
        req.currentUser,
        null,
        `Looking Through Item History`
      );
    }

    return successResponse(res, Http.ok, "Success Fetching Item History", qry);
  } catch (error) {
    return errorResponse(res, Http.internalServerError, error);
  }
};

module.exports = (routes) => {
  routes.get("/", authentication, getAnItem); // Get All
  routes.get("/:id", authentication, getAnItem); // Get One
  routes.post(
    "/save",
    authentication,
    bundle,
    validationItem,
    createItemBarang
  );
  routes.put(
    "/update/:id",
    authentication,
    bundle,
    validationItem,
    editItemBarang
  );
  routes.delete(
    "/delete/:id",
    authentication,
    validationItem,
    deleteItemBarang
  );
  routes.put("/update-stock/:id", authentication, updateStock);
  routes.get("/history/:id", authentication, historyDataBarang);
};
