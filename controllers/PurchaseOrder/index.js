const { BPurchaseOrder } = require("../../helper/bundlePurchaseOrder");
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
  routes.get("/:idPo", authentication, viewOnePurchaseOrder); // Fetch Api For Receive Item too
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
  // Api For Get All Barang
  routes.get("/get/barang", authentication, getAllBarang);
  // End Api

  routes.put(
    "/:idPo",
    authentication,
    CheckPermission,
    BPurchaseOrder,
    VPurchaseOrder,
    validationResponse,
    updatePo
  );

  // Get Receive Item
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
