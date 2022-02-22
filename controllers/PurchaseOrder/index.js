const { BPurchaseOrder } = require("../../helper/bundlePurchaseORder");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const VPurchaseOrder = require("../../middlewares/validationPurchaseOrder");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addPurchaseOrder } = require("./create");
const { deletePo } = require("./delete");
const { updatePo } = require("./update");
const {
  viewPurchaseOrder,
  viewOnePurchaseOrder,
  getAllBarang,
  listPurchaseOrder,
  listPurchaseOrderForReceiveItem,
} = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, CheckPermission, viewPurchaseOrder);
  routes.get("/:idPo", authentication, viewOnePurchaseOrder);
  routes.post(
    "/",
    authentication,
    CheckPermission,
    BPurchaseOrder,
    VPurchaseOrder,
    validationResponse,
    addPurchaseOrder
  );
  routes.delete("/:idPo", authentication, CheckPermission, deletePo);
  routes.get("/get/barang", authentication, getAllBarang);
  routes.put(
    "/:idPo",
    authentication,
    CheckPermission,
    BPurchaseOrder,
    VPurchaseOrder,
    validationResponse,
    updatePo
  );
  routes.get(
    "/get/list/:idReceive?",
    authentication,
    listPurchaseOrderForReceiveItem
  );
  // routes.get("/get/list/:idPo", authentication, listPurchaseOrder);

  // API For Sales Order

  routes.get("/get/po/:idSalesOrder?", authentication);

  // End API Sales Order
};
