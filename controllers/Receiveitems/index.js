const { BReceiveItems } = require("../../helper/bundleReceiveItems");
const authentication = require("../../middlewares/authentication");
const VReceive = require("../../middlewares/validationReceiveItems");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addReceiveItems } = require("./create");
const { deleteReceiveItem } = require("./delete");
const { updateReceiveItem } = require("./update");
const { fetchReceiveItemForUpdate } = require("./view");

module.exports = (routes) => {
  routes.post(
    "/",
    authentication,
    BReceiveItems,
    VReceive,
    validationResponse,
    addReceiveItems
  );
  routes.get("/:idReceive", authentication, fetchReceiveItemForUpdate);
  routes.delete("/:idReceive", authentication, deleteReceiveItem);
  routes.put(
    "/:idReceive",
    authentication,
    BReceiveItems,
    VReceive,
    validationResponse,
    updateReceiveItem
  );
};
