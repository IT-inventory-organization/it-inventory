const jwt = require('jsonwebtoken')
const CONFIG = require('./config.js')

const generateToken = (payload) => {
  const token = jwt.sign(payload, CONFIG.GET("JWT_SECRET_KEY"))
  return token
}

const verifyToken = (token) => {
  return jwt.verify(token, CONFIG.GET("JWT_SECRET_KEY"))
}