const authentication = require("../../middlewares/authentication");
const { addPurchaseOrder } = require("./post");

module.exports = (routes) => {
  routes.post("/", authentication, addPurchaseOrder);
};
