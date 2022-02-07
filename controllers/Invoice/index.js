const { BInvoice } = require("../../helper/bundleInvoice");
const authentication = require("../../middlewares/authentication");
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
  routes.get("/", authentication, ViewAll);
  routes.get("/:idInv", authentication, ViewOne);

  routes.post(
    "/",
    authentication,
    BInvoice,
    VInvoice,
    validationResponse,
    addInvoice
  );

  routes.put(
    "/:idInv",
    authentication,
    BInvoice,
    VInvoice,
    validationResponse,
    updateInvoice
  );

  routes.delete("/:idInv", authentication, deleteInvoice);

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
