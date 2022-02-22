const { BBill } = require("../../helper/bundleBill");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const VBill = require("../../middlewares/validateBill");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addBill } = require("./create");
const { deleteBill } = require("./delete");
const { updateBill } = require("./update");
const {
  fetchOneBill,
  fetchAllBill,
  fetchAllBillThatNotBeenUsedYet,
  fetchBillFOrAutoComplete,
} = require("./view");

module.exports = (routes) => {
  routes.get("/:idBill", authentication, fetchOneBill);
  routes.get("/", authentication, CheckPermission, fetchAllBill);

  routes.post(
    "/",
    authentication,
    CheckPermission,
    BBill,
    VBill,
    validationResponse,
    addBill
  );

  routes.put(
    "/:idBill",
    authentication,
    CheckPermission,
    BBill,
    VBill,
    validationResponse,
    updateBill
  );

  routes.delete("/:idBill", authentication, CheckPermission, deleteBill);

  // Api For Bill Payment

  /**
   * * Used For List of No Transaction
   * * For Bill Payment, paramater in url used
   * * For exception id that can be include as not used,
   * * exception paramater used only for update
   */
  routes.get(
    "/get/list/:idBillPayment?",
    authentication,
    fetchAllBillThatNotBeenUsedYet
  );

  /**
   * * For Auto Complete in Bill Payment
   * * After Select Bill in `No transaksi` Field
   */
  routes.get("/get/bill/:idBill", authentication, fetchBillFOrAutoComplete);

  // End Api Bill Payment
};
