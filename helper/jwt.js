const jwt = require("jsonwebtoken");
const CONFIG = require("../config.js");

const generateToken = (payload) => {
  const token = jwt.sign(payload, CONFIG.JWT_SECRET_KEY);
  return token;
};

const verifyToken = (token) => {
  return jwt.verify(token, CONFIG.JWT_SECRET_KEY);
};

module.exports = {
  generateToken,
  verifyToken,
};
