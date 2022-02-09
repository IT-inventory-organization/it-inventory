const { BCashDisbursement } = require("../../helper/bundleCashDisbursement");
const authentication = require("../../middlewares/authentication");
const {
  VCashDisbursement,
} = require("../../middlewares/validateCashDisbursement");
const { VQueryDate } = require("../../middlewares/validateCashReceive");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addCashDisbursement } = require("./create");
const { deleteCashDisbursement } = require("./delete");
const { updateCashDisbursement } = require("./update");
const { viewAll, viewOne } = require("./view");

/**
 *
 * @param {Routes} routes
 */
module.exports = (routes) => {
  routes.post(
    "/",
    authentication,
    BCashDisbursement,
    VCashDisbursement,
    validationResponse,
    addCashDisbursement
  );

  routes.put(
    "/:idCashDisbursement",
    authentication,
    BCashDisbursement,
    VCashDisbursement,
    updateCashDisbursement
  );

  routes.delete("/:idCashDisbursement", authentication, deleteCashDisbursement);

  routes.get("/", authentication, VQueryDate, validationResponse, viewAll);

  routes.get("/:idCashDisbursement", authentication, viewOne);
};
