const httpStatus = require("../helper/Httplib");
const config = require("../config");
const { appendFileSync } = require('fs');
const STAGE = require('../helper/Stage.interface');

function ForeignKeyViolation(message, error = null, req = null){
  log(error, req, message)
  this.message = message;
  this.name = 'ForeignKeyViolation';
  this.status = httpStatus.internalServerError;
}

function ConflictCreateData(message, error = null, req = null){
  log(error, req, message)
  this.message = message;
  this.name = 'ConflictCreateData';
  this.status = httpStatus.conflict;
}

function NotFoundException(message, error=null, req = null){
  log(error, req, message)
  this.message = message;
  this.name = 'NotFoundException';
  this.status = httpStatus.notFound
}

function ServerFault(message, error=null, req = null){
  log(error, req, message)
  this.message = message;
  this.name = 'ServerFault';
  this.status = httpStatus.internalServerError
}

function UnAuthorizedUser(message, error = null, req = null){
  log(error, req, message)
  this.message = message;
  this.name = "UnAuthorizedUser";
  this.status = httpStatus.unauthorized;
}

function BadRequest(message, error = null, req = null){
  log(error, req, message)
  this.message = message;
  this.name = "BadRequest";
  this.status = httpStatus.badRequest;
}

function returnError(error, message){
  switch (error.name) {
    case 'ReferenceError':
      throw new ServerFault(message, error);
    case 'SequelizeValidationError':
      throw new ForeignKeyViolation(message, error)
    default:
      break;
  }
}

function log(error, req = null, message = null){
  const stage = config.get('STAGE');
  if(stage == STAGE.DEVELOPMENT){
    console.log(error);
    addLog(error, req, message);
  }
}

function addLog(error, req = null, message = null){
  const date = new Date();
  let time = `[${addZero(date.getHours())}-${addZero(date.getMinutes())}-${addZero(date.getSeconds())} ${addZero(date.getDate())}-${addZero(date.getMonth() + 1)}-${addZero(date.getFullYear())}]================================================ `;

  const Data = {
    Body: req.body,
    BaseUrl: req.baseUrl,
    Params: req.params,
    Query: req.query,
    Method: req.method,
    Url: req.url,
    StatusCode: req.statusCode,
    StatusMessage: req.statusMessage
  }

  const request = JSON.stringify(Data);
  time += `\n\t\tMessage:${message}\n\t\tError:${JSON.stringify(error)}\n\t\tRequest#${request}\n`;

  try {
    appendFileSync('error.log', time);  
  } catch (err) {
    console.log(err);
  }
}

function addZero(number){
  if(number < 10){
    return `0${number}`
  }else{
    return number;
  }
}
module.exports = {
  ForeignKeyViolation,
  ConflictCreateData,
  NotFoundException,
  ServerFault,
  UnAuthorizedUser,
  returnError,
  addLog,
  BadRequest
}