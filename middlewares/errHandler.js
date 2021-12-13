const httpStatus = require("../helper/Httplib");

function ForeignKeyViolation(message){
  this.message = message;
  this.name = 'ForeignKeyViolation';
  this.status = httpStatus.internalServerError;
}

function ConflictCreateData(message){
  this.message = message;
  this.name = 'ConflictCreateData';
  this.status = httpStatus.conflict;
}

function NotFoundException(message){
  this.message = message;
  this.name = 'NotFoundException';
  this.status = httpStatus.notFound
}

function ServerFault(message){
  this.message = message;
  this.name = 'ServerFault';
  this.status = httpStatus.internalServerError
}

function UnAuthorizedUser(message){
  this.message = message;
  this.name = "UnAuthorizedUser";
  this.status = httpStatus.unauthorized;
}

module.exports = {
  ForeignKeyViolation,
  ConflictCreateData,
  NotFoundException,
  ServerFault,
  UnAuthorizedUser
}