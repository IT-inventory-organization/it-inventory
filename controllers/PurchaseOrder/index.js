const { BPurchaseOrder } = require("../../helper/bundlePurchaseORder");
const authentication = require("../../middlewares/authentication");
const VPurchaseOrder = require("../../middlewares/validationPurchaseOrder");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addPurchaseOrder } = require("./create");
const { viewPurchaseOrder, viewOnePurchaseOrder } = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, viewPurchaseOrder);
  routes.get("/:idPo", authentication, viewOnePurchaseOrder);
  routes.post(
    "/",
    authentication,
    BPurchaseOrder,
    VPurchaseOrder,
    validationResponse,
    addPurchaseOrder
  );
};
