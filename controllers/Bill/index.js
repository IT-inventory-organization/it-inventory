const { BBill } = require("../../helper/bundleBill");
const authentication = require("../../middlewares/authentication");
const VBill = require("../../middlewares/validateBill");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addBill } = require("./create");
const { deleteBill } = require("./delete");
const { updateBill } = require("./update");
const { fetchOneBill, fetchAllBill } = require("./view");

module.exports = (routes) => {
  routes.get("/:idBill", authentication, fetchOneBill);
  routes.get("/", authentication, fetchAllBill);

  routes.post("/", authentication, BBill, VBill, validationResponse, addBill);

  routes.put(
    "/:idBill",
    authentication,
    BBill,
    VBill,
    validationResponse,
    updateBill
  );

  routes.delete("/:idBill", authentication, deleteBill);
};
