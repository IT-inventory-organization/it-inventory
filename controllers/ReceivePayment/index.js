const { BReceivePayment } = require("../../helper/bundleReceivePayment");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const { VReceivePayment } = require("../../middlewares/validateReceivePayment");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addReceivePayment } = require("./create");
const { deleteReceivePayment } = require("./delete");
const { updateReceivePayment } = require("./update");
const { viewOne, viewList } = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, CheckPermission, viewList);
  routes.get("/:i", authentication, viewOne);

  routes.post(
    "/",
    authentication,
    BReceivePayment,
    VReceivePayment,
    validationResponse,
    addReceivePayment
  );

  routes.put(
    "/:i",
    authentication,
    BReceivePayment,
    VReceivePayment,
    validationResponse,
    updateReceivePayment
  );

  routes.delete("/:i", authentication, deleteReceivePayment);
};
