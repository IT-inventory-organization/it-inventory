const e = require("express");
const authentication = require("../../middlewares/authentication");

/**
 *
 * @param {e.Application} routes
 */
module.exports = (routes) => {
  routes.get("/", authentication);
};
