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

function returnError(error, message){
  switch (error.name) {
    case 'ReferenceError':
      throw new ServerFault(message);
    case 'SequelizeValidationError':
      throw new ForeignKeyViolation(message)
    default:
      break;
  }
}

module.exports = {
  ForeignKeyViolation,
  ConflictCreateData,
  NotFoundException,
  ServerFault,
  UnAuthorizedUser,
  returnError
}