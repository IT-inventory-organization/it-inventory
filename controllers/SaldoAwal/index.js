const { BSaldoAwal } = require("../../helper/bundleSaldoAwal");
const authentication = require("../../middlewares/authentication");
const { VSaldoAwal } = require("../../middlewares/validateSaldoAwal");
const { validationResponse } = require("../../middlewares/validationResponse");
const { addSaldoAwal } = require("./create");
const { viewOne } = require("./view");

module.exports = (routes) => {
  routes.get("/", authentication, viewOne);
  routes.post(
    "/",
    authentication,
    BSaldoAwal,
    VSaldoAwal,
    validationResponse,
    addSaldoAwal
  );
};
