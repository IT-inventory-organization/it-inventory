"use strict";
const { query } = require("express");
const Report = require("../database/models/report");

const authorization = async (model, id, req, extraCondition = false) => {
  let result;
  const query = {
    where: {id}
  }
  if (extraCondition) {
    query.include = [Report]
  }
  
  result = await model.findOne(query);
  // console.log(result);
  if(result == null){
    query.where = {
      reportId: id
    }
    result = await model.findOne(query);
    
    if(result == null){
      return false
    }
  }
  
  if('Report' in result) {
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