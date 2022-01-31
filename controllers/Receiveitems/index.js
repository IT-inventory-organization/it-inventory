const { BReceiveItems } = require("../../helper/bundleReceiveItems");
const authentication = require("../../middlewares/authentication");
const VReceive = require("../../middlewares/validationReceiveItems");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addReceiveItems } = require("./create");
const { deleteReceiveItem } = require("./delete");
const { updateReceiveItem } = require("./update");
const {
  fetchReceiveItemForUpdate,
  listReceiveItem,
  fetchListNoReceive,
  fetchListNoReceiveForBill,
  fetchOneDataOfReceiveItem,
} = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, listReceiveItem);
  routes.get("/:idReceive", authentication, fetchReceiveItemForUpdate);

  routes.post(
    "/",
    authentication,
    BReceiveItems,
    VReceive,
    validationResponse,
    addReceiveItems
  );

  routes.delete("/:idReceive", authentication, deleteReceiveItem);

  routes.put(
    "/:idReceive",
    authentication,
    BReceiveItems,
    VReceive,
    validationResponse,
    updateReceiveItem
  );

  // API Receive Untuk Bill

  /**
   * * Digunakan Untuk menangkap data Receive
   * * Untuk Dipakai di Bill
   */
  routes.get("/get/data/:idReceive", authentication, fetchOneDataOfReceiveItem);

  /**
   * * Mengambil Data No Receive Yang belum dipakai Untuk Bill
   */
  routes.get("/get/list/:IdBill?", authentication, fetchListNoReceiveForBill);

  // End API Receive Untuk Bill
};
