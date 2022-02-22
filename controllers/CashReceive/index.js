const { BCashReceive } = require("../../helper/bundleCashReceive");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const {
  VCashReceive,
  VQueryDate,
} = require("../../middlewares/validateCashReceive");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addCashReceive } = require("./create");
const { deleteCashReceive } = require("./delete");
const { updateCashReceive } = require("./update");
const { viewAll, viewOne } = require("./view");

/**
 *
 * @param {Routes} routes
 */
module.exports = (routes) => {
  routes.post(
    "/",
    authentication,
    CheckPermission,
    BCashReceive,
    VCashReceive,
    validationResponse,
    addCashReceive
  );

  routes.put(
    "/:idCashReceive",
    authentication,
    CheckPermission,
    BCashReceive,
    VCashReceive,
    updateCashReceive
  );

  routes.delete(
    "/:idCashReceive",
    authentication,
    CheckPermission,
    deleteCashReceive
  );

  routes.get(
    "/",
    authentication,
    CheckPermission,
    VQueryDate,
    validationResponse,
    viewAll
  );

  routes.get("/:idCashReceive", authentication, viewOne);
};
