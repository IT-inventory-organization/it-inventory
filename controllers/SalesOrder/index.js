const { BSalesOrder } = require("../../helper/bundleSalesOrder");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const VSalesOrder = require("../../middlewares/validateSalesOrder");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addSalesOrder } = require("./create");
const { deleteSalesOrder } = require("./delete");
const { updateSalesOrder } = require("./update");
const {
  ViewListOfSalesOrder,
  fetchOneSalesOrder,
  ListOfSalesOrderThatNotBeenUsedYet,
  fetchDataForDeliveryOrderAutoComplete,
} = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, CheckPermission, ViewListOfSalesOrder);
  routes.get("/:idSo", authentication, fetchOneSalesOrder);

  routes.post(
    "/",
    authentication,
    CheckPermission,
    BSalesOrder,
    VSalesOrder,
    validationResponse,
    addSalesOrder
  );

  routes.put(
    "/:idSo",
    authentication,
    CheckPermission,
    BSalesOrder,
    VSalesOrder,
    validationResponse,
    updateSalesOrder
  );

  routes.delete("/:idSo", authentication, CheckPermission, deleteSalesOrder);

  // Api For Delivery Order

  /**
   * * Fetching Data For Dropdown in Delivery Order
   * * And Filtering Sales ORder That Already Been Used
   */
  routes.get(
    "/get/list/:idDo?",
    authentication,
    ListOfSalesOrderThatNotBeenUsedYet
  );

  routes.get(
    "/get/order/:idSo",
    authentication,
    fetchDataForDeliveryOrderAutoComplete
  );

  // End Api Delivery Order
};
