const httpStatus = require("../helper/Httplib");

function ForeignKeyViolation(message){
  this.message = message;
  this.name = 'ForeignKeyViolation';
  this.status = httpStatus.internalServerError
}

function ConflictCreateData(message){
  this.message = message;
  this.name = 'ConflictCreateData',
  this.status = httpStatus.conflict
}

module.exports = {
  ForeignKeyViolation,
  ConflictCreateData
}