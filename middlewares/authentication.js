const {verifyToken} = require("../helper/jwt");
// const User = require("../database/models/user");
const InfoPengguna = require('../database/models/info_pengguna');
const { errorResponse } = require("../helper/Response");
const httpStatus = require("../helper/Httplib");
const Role = require("../database/models/role");

const authentication = async (req, res, next) =>{
  const bearerToken = req.headers.authorization;
  
  if(!bearerToken) {
    return errorResponse(res, httpStatus.badRequest, "Please login first");
  }
  const token = bearerToken.split(' ')[1];
  try {
    const decode = await verifyToken(token);
    const {user_id: id} = decode;
    const user = await InfoPengguna.findOne({where: {id}, include:[Role]});

    if (user){
      req.currentUser = user.id;
      req.currentRole = user.role.name
      next();
    } else {  
      return errorResponse(res, httpStatus.badRequest, "Please login first");
    }
  } catch (err) {

    return errorResponse(res, httpStatus.badRequest, "Please login first");
  }
}

module.exports = authentication