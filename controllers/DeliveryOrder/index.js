const { BDeliveryOrder } = require("../../helper/bundleDeliveryOrder");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const { VDeliveryOrder } = require("../../middlewares/validateDeliveryOrder");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addDeliveryOrder } = require("./create");
const { deleteDeliveryOrder } = require("./delete");
const { updateDeliveryOrder } = require("./update");
const {
  FetchAllList,
  FetchOneList,
  FetchListOfNoDeliveryOrderThatNotBeenUsedYet,
  FetcOneDeliveryOrderAutoCompleteInvoice,
} = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, CheckPermission, FetchAllList);
  routes.get("/:idDo", authentication, FetchOneList);

  routes.post(
    "/",
    authentication,
    CheckPermission,
    BDeliveryOrder,
    VDeliveryOrder,
    validationResponse,
    addDeliveryOrder
  );

  routes.put(
    "/:idDo",
    authentication,
    CheckPermission,
    BDeliveryOrder,
    VDeliveryOrder,
    validationResponse,
    updateDeliveryOrder
  );

  routes.delete("/:idDo", authentication, CheckPermission, deleteDeliveryOrder);

  // Api For Invoice

  routes.get(
    "/get/list/:idInv?",
    authentication,
    FetchListOfNoDeliveryOrderThatNotBeenUsedYet
  );

  routes.get(
    "/get/do/:idDo",
    authentication,
    FetcOneDeliveryOrderAutoCompleteInvoice
  );

  // End Api Invoice
};
