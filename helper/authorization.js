"use strict";
const { query } = require("express");
const Report = require("../database/models/report");

const authorization = async (model, id, req, extraCondition = false) => {
  const query = {
    where: {id}
  }
  if (extraCondition) {
    query.include = [Report]
  }
  
  const result = await model.findOne(query);

  if(result.Report != null || 'Report' in result) {
    if (result.Report.userId === req.currentUser) {
      return true
    }
  } else {
    if(result.userId === req.currentUser) {
      return true
    }
  }
  return false
}

module.exports = authorization;