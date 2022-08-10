const e = require("express");
const {
  BUpdateStatusDeliveryOrder,
} = require("../../helper/bundleDeliveryOrder");
const {
  BInvoice,
  BUpdateStatusInvoice,
} = require("../../helper/bundleInvoice");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const { VInvoice } = require("../../middlewares/validateInvoice");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addInvoice } = require("./create");
const { deleteInvoice } = require("./delete");
const { updateInvoice, updateInvoiceStatusApprove } = require("./update");
const {
  ViewOne,
  ViewAll,
  fetchAllInvoiceThatNotBeenUsedYet,
  fetchInvoiceForAutoComplete,
  FetchingWithBoss,
} = require("./view");

/**
 *
 * @param {e.Application} routes
 */
module.exports = (routes) => {
  routes.get("/", authentication, CheckPermission, ViewAll);
  routes.get("/:idInv", authentication, ViewOne);

  routes.post(
    "/",
    authentication,
    CheckPermission,
    BInvoice,
    VInvoice,
    validationResponse,
    addInvoice
  );

  routes.put(
    "/:idInv",
    authentication,
    CheckPermission,
    BInvoice,
    VInvoice,
    validationResponse,
    updateInvoice
  );

  routes.delete("/:idInv", authentication, CheckPermission, deleteInvoice);

  routes.put(
    "/status/:idInv",
    authentication,
    BUpdateStatusInvoice,
    updateInvoiceStatusApprove
  );

  routes.get("/mobile/owner/:idInv?", authentication, FetchingWithBoss);

  // Api For Receive Payment

  routes.get(
    "/get/inv/:idReceivePayment?",
    authentication,
    fetchAllInvoiceThatNotBeenUsedYet
  );

  routes.get(
    "/get/invData/:idInv",
    authentication,
    fetchInvoiceForAutoComplete
  );
  // Api For Receive Payment
};
