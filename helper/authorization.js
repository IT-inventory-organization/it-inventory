"use strict";
const Report = require("../database/models/report");

const authorization = async (model, id, req) => {
  const result = await model.findOne({
    where: {id},
    include: Report
  })
  if (result.Report.userId === req.currentUser) {
    return true
  }
  return false
}

module.exports = authorization;