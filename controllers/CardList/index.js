const { BCardList } = require("../../helper/bundleCardList");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const VCardList = require("../../middlewares/validationCardList");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addContactCardList } = require("./create");
const { deleteCardList } = require("./delete");
const { updateCardList } = require("./update");
const {
  viewAllCardList,
  FetchOneList,
  fetchSupplierForPurchaseOrder,
  fetchCustomerForSalesOrder,
} = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, CheckPermission, viewAllCardList);
  routes.get("/:idContact", authentication, FetchOneList);

  routes.post(
    "/",
    authentication,
    CheckPermission,
    BCardList,
    VCardList,
    validationResponse,
    addContactCardList
  );

  routes.put(
    "/:idContact",
    authentication,
    CheckPermission,
    BCardList,
    VCardList,
    validationResponse,
    updateCardList
  );

  routes.delete("/:idContact", authentication, CheckPermission, deleteCardList);

  // API For Purchase Order

  /**
   * * Get Supplier For Purchase Order
   * * Checking If Supplier is Already Have
   * * A Relation With Purchase Order
   */
  routes.get(
    "/get/supplier/:idPo?",
    authentication,
    fetchSupplierForPurchaseOrder
  );

  // End Api For Purchase Order

  // Api For Sales Order

  /**
   * * Get Customer List For
   * * Sales Order, And Checking
   * * Customer is Already Been Used By
   * * Other Sales Order, Or Not
   */
  routes.get(
    "/get/customer/:idSo?",
    authentication,
    fetchCustomerForSalesOrder
  );

  // End Api For Sales Order
};
