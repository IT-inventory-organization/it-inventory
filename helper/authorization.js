"use strict";
const { query } = require("express");
const InfoPengguna = require("../database/models/info_pengguna");
const Report = require("../database/models/report");
const { UnAuthorizedUser, NotFoundException } = require("../middlewares/errHandler");
const { errorResponse } = require("./Response");

const authorization = async (model, id, req, extraCondition = false) => {
  let result;
  const query = {
    where: {id}
  }
  if (extraCondition) {
    query.include = [Report]
  }
  try {
    result = await model.findOne(query);
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
  } catch (error) {
    throw error
  }
}

const authorizationReport = async (req, res, next) => {
  try {
    const {idReport} = req.params;
    const query = {
      where: {
        id: idReport,
        isDelete: false
      }
    };
  
    const report = await Report.findOne(query);

    if(!report){
      throw new NotFoundException("Data Tidak Di Temukan");
    }
  
    const resultReport = report.toJSON();
    
    if(resultReport.userId === req.currentUser){
      next();
    }else{
      throw new UnAuthorizedUser("User Tidak Memiliki Akses Di Report ini");
    }
  } catch (error) {

    return errorResponse(res, error.status, error.message);
  }

}

module.exports = {
  authorization, 
  authorizationReport
};