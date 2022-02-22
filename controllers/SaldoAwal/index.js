const { BSaldoAwal } = require("../../helper/bundleSaldoAwal");
const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const { VSaldoAwal } = require("../../middlewares/validateSaldoAwal");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addSaldoAwal } = require("./create");
const { viewOne } = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, CheckPermission, viewOne);
  routes.post(
    "/",
    authentication,
    CheckPermission,
    BSaldoAwal,
    VSaldoAwal,
    validationResponse,
    addSaldoAwal
  );
};
