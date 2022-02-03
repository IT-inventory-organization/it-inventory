const { BInvoice } = require("../../helper/bundleInvoice");
const authentication = require("../../middlewares/authentication");
const { VInvoice } = require("../../middlewares/validateInvoice");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addInvoice } = require("./create");
const { deleteInvoice } = require("./delete");
const { updateInvoice } = require("./update");
const { ViewOne, ViewAll } = require("./view");

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
};
