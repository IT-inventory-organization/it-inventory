const { BBillPayment } = require("../../helper/bundleBillPayment");
const authentication = require("../../middlewares/authentication");
const {
  CheckPermission,
  CheckPermissionInsert,
} = require("../../middlewares/permission");
const { VBillPayment } = require("../../middlewares/validateBillPayment");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addBillPayment } = require("./create");
const { deleteBillPayment } = require("./delete");
const { updateBillPaymentItem } = require("./update");
const { viewAllList, viewOneList } = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, CheckPermission, viewAllList);
  routes.get("/:idBillPayment", authentication, viewOneList);

  routes.post(
    "/",
    authentication,
    CheckPermission,
    BBillPayment,
    VBillPayment,
    validationResponse,
    addBillPayment
  );
  routes.put(
    "/:idBillPayment",
    authentication,
    CheckPermission,
    BBillPayment,
    VBillPayment,
    validationResponse,
    updateBillPaymentItem
  );

  routes.delete(
    "/:idBillPayment",
    authentication,
    CheckPermission,
    deleteBillPayment
  );
};
