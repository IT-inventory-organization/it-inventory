const { BBillPayment } = require("../../helper/bundleBillPayment");
const authentication = require("../../middlewares/authentication");
const { VBillPayment } = require("../../middlewares/validateBillPayment");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addBillPayment } = require("./create");
const { deleteBillPayment } = require("./delete");
const { updateBillPaymentItem } = require("./update");
const { viewAllList, viewOneList } = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, viewAllList);
  routes.get("/:idBillPayment", authentication, viewOneList);

  routes.post(
    "/",
    authentication,
    BBillPayment,
    VBillPayment,
    validationResponse,
    addBillPayment
  );
  routes.put(
    "/:idBillPayment",
    authentication,
    BBillPayment,
    VBillPayment,
    validationResponse,
    updateBillPaymentItem
  );

  routes.delete("/:idBillPayment", authentication, deleteBillPayment);
};
