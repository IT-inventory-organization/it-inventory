const { BCardList } = require("../../helper/bundleCardList");
const authentication = require("../../middlewares/authentication");
const VCardList = require("../../middlewares/validationCardList");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addContactCardList } = require("./create");
const { deleteCardList } = require("./delete");
const { updateCardList } = require("./update");
const {
  viewAllCardList,
  FetchOneList,
  fetchSupplierForPurchaseOrder,
} = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, viewAllCardList);
  routes.get("/:idContact", authentication, FetchOneList);
  routes.get(
    "/get/supplier/:idContact?",
    authentication,
    fetchSupplierForPurchaseOrder
  );

  routes.post(
    "/",
    authentication,
    BCardList,
    VCardList,
    validationResponse,
    addContactCardList
  );

  routes.put(
    "/:idContact",
    authentication,
    BCardList,
    VCardList,
    validationResponse,
    updateCardList
  );

  routes.delete("/:idContact", authentication, deleteCardList);
};
