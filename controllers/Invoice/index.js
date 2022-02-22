const { BInvoice } = require("../../helper/bundleInvoice");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const { VInvoice } = require("../../middlewares/validateInvoice");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addInvoice } = require("./create");
const { deleteInvoice } = require("./delete");
const { updateInvoice } = require("./update");
const {
  ViewOne,
  ViewAll,
  fetchAllInvoiceThatNotBeenUsedYet,
  fetchInvoiceForAutoComplete,
} = require("./view");

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
