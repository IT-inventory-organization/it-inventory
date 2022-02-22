const authentication = require("../../middlewares/authentication");
const { CheckPermission } = require("../../middlewares/permission");
const { getHistoryBarang } = require("./barang");

module.exports = (routes) => {
  routes.get("/:idBarang", authentication, CheckPermission, getHistoryBarang);
};
