const { BDeliveryOrder } = require("../../helper/bundleDeliveryOrder");
const authentication = require("../../middlewares/authentication");
const { VDeliveryOrder } = require("../../middlewares/validateDeliveryOrder");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addDeliveryOrder } = require("./create");
const { deleteDeliveryOrder } = require("./delete");
const { FetchAllList, FetchOneList } = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, FetchAllList);
  routes.get("/:idDo", authentication, FetchOneList);

  routes.post(
    "/",
    authentication,
    BDeliveryOrder,
    VDeliveryOrder,
    validationResponse,
    addDeliveryOrder
  );

  routes.delete("/:idDo", authentication, deleteDeliveryOrder);
};
