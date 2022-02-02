const { BPurchaseOrder } = require("../../helper/bundlePurchaseORder");
const authentication = require("../../middlewares/authentication");
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
  routes.delete("/:idPo", authentication, deletePo);
  routes.get("/get/barang", authentication, getAllBarang);
  routes.put(
    "/:idPo",
    authentication,
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
