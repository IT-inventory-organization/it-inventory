const authentication = require("../../middlewares/authentication");
const { getHistoryBarang } = require("./barang");

module.exports = (routes) => {
  routes.get("/:idBarang", authentication, getHistoryBarang);
};
