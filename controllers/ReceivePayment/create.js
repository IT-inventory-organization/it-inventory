const sequelize = require("../../configs/database");
const httpStatus = require("../../helper/Httplib");
const { changeStatus } = require("../../helper/Invoice");
const { AddReceivePayment } = require("../../helper/ReceivePayment");
const {
  AddReceivePaymentDetail,
} = require("../../helper/ReceivePayment/detail");
const { errorResponse, successResponse } = require("../../helper/Response");

const addReceivePayment = async (req, res) => {
  let t;
  try {
    let { ReceivePaymentDetail, ...d } = req.body.DataToInput;
    t = await sequelize.transaction();
    const dd = ReceivePaymentDetail;

    ReceivePaymentDetail.jumlahTotal = ReceivePaymentDetail.totalPenerimaan;

    const r = await AddReceivePayment(d, t);

    ReceivePaymentDetail.idReceivePayment = r.id;

    await AddReceivePaymentDetail(dd, t);
    const total = +dd.jumlahTotal + +dd.total;

    if (ReceivePaymentDetail.jumlah <= total) {
      await changeStatus(req, d.idInv, t);
    }

    await t.commit();

    return successResponse(
      res,
      httpStatus.created,
      "Success Create Receive Payment"
    );
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    return errorResponse(
      res,
      httpStatus.internalServerError,
      "Failed To Craete Receive Payment"
    );
  }
};

module.exports = { addReceivePayment };
