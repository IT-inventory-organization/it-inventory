const {verifyToken} = require("../helpers/jwt");
const User = require("../database/models/user");
const { errorResponse } = require("../helper/Response");
const httpStatus = require("../helper/Httplib");
const Role = require("../database/models/role");

const authentication = async (req, res, next) =>{
  const {token} = req.headers
  if(!token) {
    return next({
      type : "Bad Request",
      code : "400",
      msg : "Please Login First"
    });
  }
  try {
    const decode = verifyToken(token);
    const {id} = decode;
    const user = await User.findOne({where: {id}, include:[Role]});
    if (user){
      req.currentUser = user.id;
      req.currentRole = user.Role.name
      next();
    } else {
      return errorResponse(res, httpStatus.badRequest, "Please login first");
    }
  } catch (err) {
    return errorResponse(res, httpStatus.badRequest, "Please login first");
  }
}

module.exports = authentication